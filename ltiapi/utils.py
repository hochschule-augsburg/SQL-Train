# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later
#
# All methods were copied and altered from its original location
# at <https://github.com/Hyperchalk/Hyperchalk/>.

import json
import re
from typing import Any, Dict, Generic, List, Optional, Sequence, TypeVar
from urllib.parse import urlparse, urlunsplit

from asgiref.sync import sync_to_async
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.conf import settings
from django.contrib.auth.models import Group
from django.http import HttpRequest
from django.templatetags.static import static
from django.utils.translation import gettext as _
from pylti1p3.contrib.django.lti1p3_tool_config import DjangoDbToolConf
from pylti1p3.contrib.django.lti1p3_tool_config.models import LtiTool, LtiToolKey

from sql_training.utils import absolute_reverse

from . import models as m

ChainedObj = TypeVar("ChainedObj")


class Chain(Generic[ChainedObj]):
    """
    A class for optional chaining in Python.

    Contains a tree of ``dict`` s, ``list`` s and ``object`` s, that can be queried via
    ``__getitem__`` (``[...]``). The object contained in the class can be retrieved via
    calling the ``Chain`` instance. If any of the items or attributes in the getter chain
    contains ``None``, the call return value will be ``None``, too.
    """

    def __init__(self, obj: ChainedObj) -> None:
        self.obj = obj

    def get(self, key: Any, default=None):
        if isinstance(self.obj, dict):
            return Chain(self.obj.get(key, None))
        if isinstance(self.obj, (list, tuple)) and 0 <= key < len(self.obj):
            return Chain(self.obj[key])
        if isinstance(key, str):
            return Chain(getattr(self.obj, key, None))
        return Chain(default)

    __getitem__ = get

    def __call__(self) -> ChainedObj:
        return self.obj


def chain(obj: Any, members: Sequence[Any], default=None):
    """
    Optional ``Chain`` as a function. The most capable getter you have ever seen.

    :param obj: the object to wrap.

    :param args: ``Sequence`` of object members that will be used to get into the object's members.

    :returns: the sought member or the default value.
    """
    members = list(members)
    chained = Chain(obj)
    while members:
        chained = chained[members.pop(0)]
    return chained() or default


def build_absolute_uri_without_request(
    url: str,
    query: str = "",
    host: str = settings.LINK_BASE,
    protocol: Optional[str] = "https",
):
    """
    Gives the absolute URI of a resource after reversing.

    ``request.build_absolute_uri()`` should be used for this usually, but sometimes the
    ``request`` is not available.

    :param url: a site-relative url

    :param query: the url query string. Defaults to an empty string.

    :param host: the current host. defaults to ``settings.LINK_BASE``.

    :param protocol: you can specify a protocol (``http(s)``) here. Defaults to ``https``.
    """
    return urlunsplit((protocol, host, url, query, None))


async def generate_key_pair(key_size=4096):
    """
    Generates an RSA key pair. Async because generating a key can be resource intensive.

    :param key_size: key bits

    :returns: a dict with the keys "public" and "private", containing PEM-encoded RSA keys. \
        This is not returned as a tuple so that the user of this function never confuses them.
    """
    generate_private_key = sync_to_async(
        rsa.generate_private_key, thread_sensitive=False
    )
    private_key = await generate_private_key(
        public_exponent=65537,
        key_size=key_size,
    )
    public_key = private_key.public_key()

    private_key_str = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()

    public_key_str = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()

    return {"private": private_key_str, "public": public_key_str}


async def keys_for_issuer(issuer_name: str) -> LtiToolKey:
    get_or_create_key = sync_to_async(LtiToolKey.objects.get_or_create)
    key_obj, created = await get_or_create_key(name=issuer_name)
    if created:
        key_pair = await generate_key_pair()
        key_obj.private_key = key_pair["private"]
        key_obj.public_key = key_pair["public"]
        await sync_to_async(key_obj.save)()
    return key_obj


async def make_tool_config_from_openid_config_via_link(
    openid_config: Dict[str, Any],
    openid_registration: Dict[str, Any],
    one_off_registration: m.OneOffRegistrationLink,
):
    conf_spec = "https://purl.imsglobal.org/spec/lti-platform-configuration"
    assert (
        conf_spec in openid_config
    ), "The OpenID config is not an LTI platform configuration"

    tool_spec = "https://purl.imsglobal.org/spec/lti-tool-configuration"
    assert (
        tool_spec in openid_registration
    ), "The OpenID registration is not an LTI tool configuration"

    deployment_ids = [openid_registration[tool_spec]["deployment_id"]]

    consumer_config = LtiTool(
        title=one_off_registration.consumer_name,
        issuer=openid_config["issuer"],
        client_id=openid_registration["client_id"],
        auth_login_url=openid_config["authorization_endpoint"],
        auth_token_url=openid_config["token_endpoint"],
        auth_audience=openid_config["token_endpoint"],
        key_set_url=openid_config["jwks_uri"],
        tool_key=await keys_for_issuer(openid_config["issuer"]),
        deployment_ids=json.dumps(deployment_ids),
    )
    await sync_to_async(consumer_config.save)()  # type: ignore
    return consumer_config


def lti_registration_data(request: HttpRequest):
    return {
        "response_types": ["id_token"],
        "application_type": "web",
        "client_name": settings.config["LTI"]["title"],
        "initiate_login_uri": absolute_reverse(request, "lti:login"),
        "grant_types": ["implicit", "client_credentials"],
        "jwks_uri": absolute_reverse(request, "lti:jwks"),
        "token_endpoint_auth_method": "private_key_jwt",
        "redirect_uris": [
            absolute_reverse(request, "lti:launch"),
            request.build_absolute_uri("/"),
        ],
        # https://www.imsglobal.org/spec/security/v1p0/#h_scope-naming-conventions
        "scope": [
            "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
        ],
        "https://purl.imsglobal.org/spec/lti-tool-configuration": {
            "domain": request.get_host(),  # get_host includes the port.
            "target_link_uri": absolute_reverse(request, "lti:launch"),
            "claims": ["iss", "sub", "name"],
            "messages": [
                {
                    "type": "LtiDeepLinkingRequest",
                    "target_link_uri": absolute_reverse(request, "lti:launch"),
                    "label": str(_("SQL-Train DeepLink")),
                }
            ],
            "description": settings.config["LTI"]["description"],
        },
        "logo_uri": request.build_absolute_uri(static("ltiapi/favicon-96.png")),
    }


def get_launch_url(request: HttpRequest):
    """
    Method code from https://github.com/dmitry-viskov/pylti1.3-django-example.git
    """
    target_link_uri = request.POST.get(
        "target_link_uri", request.GET.get("target_link_uri", None)
    )
    if not target_link_uri:
        raise Exception('Missing "target_link_uri" param')
    return target_link_uri


user_transform = re.compile(r"[^\w@.+-]")

ROLE_START = "http://purl.imsglobal.org/vocab/lis/v2/"


def get_roles(message_launch_data: dict) -> List[Group]:
    return [
        Group.objects.get_or_create(name=role[len(ROLE_START) :])[0]
        for role in message_launch_data.get(f"{CLAIM}/roles", [])
    ]


def is_superior(user: m.LTIUser) -> bool:
    return user.groups.filter(name__in=m.SUPERIOR_ROLES).exists() or user.is_staff


CLAIM = "https://purl.imsglobal.org/spec/lti/claim"


def get_message_data(message_launch_data: dict, data: str):
    return message_launch_data.get(f"{CLAIM}/{data}", {})


def get_lti_tool(tool_conf: DjangoDbToolConf, message_launch_data: dict) -> dict:
    return tool_conf.get_lti_tool(
        message_launch_data["iss"], message_launch_data["aud"]
    )


def get_lms(message_launch_data: dict):
    return urlparse(message_launch_data["iss"]).hostname


def get_course_from_launch_data(message_launch_data: dict) -> m.Course:
    defaults: Dict[str, str] = {}
    defaults |= get_message_data(message_launch_data, "context")
    course_id = defaults.pop("id")
    lms = get_lms(message_launch_data)
    defaults |= {
        "tool_" + k: v
        for k, v in get_message_data(message_launch_data, "resource_link").items()
    }
    defaults |= get_message_data(message_launch_data, "launch_presentation")
    course, __ = m.Course.objects.get_or_create(
        lms=lms, course_id=course_id, defaults=defaults
    )
    return course


def get_user_from_launch_data(
    message_launch_data: dict, lti_tool: LtiTool
) -> m.LTIUser:
    # log the user in. if this is the user's first visit, save them to the database before.
    # 1) extract user information from the data passed by the consumer
    lms_username = get_message_data(message_launch_data, "ext").get("user_username")  # type: ignore
    course = get_course_from_launch_data(message_launch_data)
    groups = get_roles(message_launch_data)

    # 2) get / create the user from the db so they can be logged in
    user, __ = m.LTIUser.objects.get_or_create(
        lms_username=lms_username,
        course=course,
        defaults={
            "registered_via": lti_tool,
            "username": f"{lms_username}@{get_lms(message_launch_data)}-{course.course_id}",
            "first_name": message_launch_data.get("given_name", ""),
            "last_name": message_launch_data.get("family_name", ""),
            "email": message_launch_data.get("email", ""),
        },
    )
    user.groups.set(groups)
    # make superior_roles staff
    if set(map(lambda e: e.name, groups)) & set(m.SUPERIOR_ROLES):
        user.is_staff = True
    user.save()
    return user
