# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later
#
# All methods were copied and altered from its original location
# at <https://github.com/Hyperchalk/Hyperchalk/>.

import asyncio
import logging
from typing import List, Optional, cast

import aiohttp
from asgiref.sync import async_to_sync, sync_to_async
from csp.decorators import csp_exempt, csp_update
from django.conf import settings
from django.contrib.auth import login
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseRedirect,
    JsonResponse,
)
from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.views.generic import DetailView
from pylti1p3.contrib.django import (
    DjangoCacheDataStorage,
    DjangoMessageLaunch,
    DjangoOIDCLogin,
)
from pylti1p3.contrib.django.lti1p3_tool_config import DjangoDbToolConf
from pylti1p3.deep_link_resource import DeepLinkResource

from sql_training.settings import config
from sql_training.utils import absolute_reverse

from . import models as m
from .utils import (
    get_launch_url,
    get_lti_tool,
    get_user_from_launch_data,
    lti_registration_data,
    make_tool_config_from_openid_config_via_link,
)


@method_decorator(csp_exempt, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class RegisterConsumerView(DetailView):
    """
    This View implements LTI Advantage Automatic registration. It supports GET for the user
    to control the configuration steps and POST, which starts the consumer configuration.
    """

    template_name = "ltiapi/register_consumer_start.html"
    end_template_name = "ltiapi/register_consumer_result.html"
    model = m.OneOffRegistrationLink
    context_object_name = "link"

    def get_template_names(self) -> List[str]:
        if self.request.method == "POST":
            return [self.end_template_name]
        return [self.template_name]

    # pylint: disable = invalid-overridden-method, attribute-defined-outside-init
    @async_to_sync
    async def get(self, request: HttpRequest, *args, **kwargs):
        return await sync_to_async(super().get)(request, *args, **kwargs)  # type: ignore

    @async_to_sync
    async def post(self, request: HttpRequest, *args, **kwargs):
        """
        Register the application as a provider via the LTI registration flow.

        The configuration flow is well explained at https://moodlelti.theedtech.dev/dynreg/
        """
        # verify that the registration link is unused
        self.object = reg_link = await sync_to_async(self.get_object)()  # type: ignore
        if reg_link.registered_consumer is not None:
            ctx = {
                "error": _(
                    "The registration link has already been used. Please ask "
                    "the admin of the LTI app for a new registration link."
                )
            }
            return self.render_to_response(context=ctx)

        # prepare for getting data about the consumer
        openid_config_endpoint = request.GET.get("openid_configuration")
        jwt_str = request.GET.get("registration_token")

        if not openid_config_endpoint:
            # logger.warning(
            #     "a client tried to register but did not supply the proper parameters. The supplied "
            #     "parameters are:\n%s",
            #     pformat(request.GET.lists),
            # )
            return HttpResponse(
                _(
                    "No configuration endpoint was found in the parameters. Are you trying to "
                    "register a legacy LTI consumer? This app only supports LTI 1.3 Advantage."
                )
            )

        async with aiohttp.ClientSession() as session:
            # get information about how to register to the consumer
            # logger.info('Getting registration data from "%s"', openid_config_endpoint)
            resp = await session.get(openid_config_endpoint)
            openid_config = await resp.json()

            # send registration to the consumer
            tool_provider_registration_endpoint = openid_config["registration_endpoint"]
            registration_data = lti_registration_data(request)
            # logger.info('Registering tool at "%s"', tool_provider_registration_endpoint)
            resp = await session.post(
                tool_provider_registration_endpoint,
                json=registration_data,
                headers={
                    "Authorization": "Bearer " + jwt_str,
                    "Accept": "application/json",
                },
            )
            openid_registration = await resp.json()
        try:
            # use the information about the registration to regsiter the consumer to this app
            consumer = await make_tool_config_from_openid_config_via_link(
                openid_config, openid_registration, reg_link
            )
        except AssertionError as e:
            # error if the data from the consumer is missing mandatory information
            ctx = self.get_context_data(registration_success=False, error=e)
            return self.render_to_response(ctx, status=406)

        await sync_to_async(reg_link.registration_complete)(consumer)

        logging.info(
            'Registration of issuer "%s" with client %s complete',
            consumer.issuer,
            consumer.client_id,
        )
        ctx = self.get_context_data(registration_success=True)
        return self.render_to_response(ctx)


async def oidc_jwks(
    request: HttpRequest, issuer: Optional[str] = None, client_id: Optional[str] = None
):
    """JWT signature delivery endpoint"""
    tool_conf = DjangoDbToolConf()
    get_jwks = sync_to_async(tool_conf.get_jwks)
    return JsonResponse(await get_jwks(issuer, client_id))


@csp_update(SCRIPT_SRC=("'unsafe-inline'"))
@csrf_exempt
def oidc_login(request: HttpRequest):
    """
    This just verifies that the requesting consumer is allowed to log in and tells the consumer,
    where to go next. The actual user login happens when the LTI launch is performed.
    """
    tool_conf = DjangoDbToolConf()
    launch_data_storage = DjangoCacheDataStorage()

    oidc_login_handle = DjangoOIDCLogin(
        request, tool_conf, launch_data_storage=launch_data_storage
    )
    target_link_uri = get_launch_url(request)
    oidc_redirect = oidc_login_handle.enable_check_cookies().redirect(
        target_link_uri, False
    )
    return oidc_redirect


@csrf_exempt  # The launch can only be triggered with a valid JWT issued by a registered platform.
@require_POST
def lti_launch(request: HttpRequest):
    """
    Implements the LTI launch. It logs the user in and
    redirects them according to the requested launch type.
    """
    # parse and verify the data that was passed by the LTI consumer
    tool_conf = DjangoDbToolConf()
    launch_data_storage = DjangoCacheDataStorage()
    message_launch = DjangoMessageLaunch(
        request, tool_conf, launch_data_storage=launch_data_storage
    )
    message_launch_data = cast(dict, message_launch.get_launch_data())

    lti_tool = get_lti_tool(tool_conf, message_launch_data)

    user = get_user_from_launch_data(message_launch_data, lti_tool)  # type: ignore
    login(request, user)

    if message_launch.is_data_privacy_launch():
        return HttpResponseRedirect(absolute_reverse(request, "privacy"))

    # real launch
    if message_launch.is_resource_launch():
        # the course ids get stored to the session. one side effect of this is that a board that
        # has been visited in the context of a course once could be visited in other courses
        # contexts or with no context at all as well.
        request.session.set_expiry(0)
        # request.session["course_ids"] = allowed_course_ids

        return redirect("/")

    return HttpResponseBadRequest(_("Unknown or unsupported message type provided."))


def login_lms(request):
    return render(request, "ltiapi/login.html", context=config)
