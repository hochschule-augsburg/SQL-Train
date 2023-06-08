// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from "react"
import CustomButton from "../button/CustomButton"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { useTranslation } from "react-i18next"
import If from "../conditional/If"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    modal: {
        top: "15%",
    },
}))

interface Props {
    onAccept: () => void
    onReject: () => void
}

/**
 * CookieDisclaimer component displays a cookie disclaimer modal.
 *
 * @param {Props} props - Component properties.
 * @param {function} props.onAccept - Callback function triggered when the user accepts the disclaimer.
 * @param {function} props.onReject - Callback function triggered when the user rejects the disclaimer.
 * @returns {JSX.Element} CookieDisclaimer component.
 */
const CookieDisclaimer: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")
    const { classes } = useStyles()

    const { onAccept, onReject } = props

    const [showReject, setShowReject] = useState<boolean>(false)

    return (
        <Modal isOpen={true} className={classes.modal}>
            <ModalHeader>Beta</ModalHeader>

            <ModalBody>{t("general.cookies.betaInfo")}</ModalBody>

            <ModalHeader>{t("general.cookies.plural")}</ModalHeader>

            <ModalBody>
                {t("general.cookies.disclaimer")}
                <br />
                <a href="/privacy" target="_blank">
                    {t("general.cookies.privacy")}
                </a>
                <br />
                <If condition={showReject}>
                    {t("general.cookies.rejectDisclaimer")}
                </If>
            </ModalBody>

            <ModalFooter>
                <CustomButton
                    text={t("general.cookies.reject")}
                    onClick={() => {
                        onReject()
                        setShowReject(true)
                    }}
                />
                <CustomButton
                    text={t("general.cookies.accept")}
                    onClick={onAccept}
                />
            </ModalFooter>
        </Modal>
    )
}

export default CookieDisclaimer
