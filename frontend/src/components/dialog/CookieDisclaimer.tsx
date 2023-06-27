// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import CustomButton from "../button/CustomButton"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { useTranslation } from "react-i18next"
import { makeStyles } from "tss-react/mui"
import config from "../../../../config.json"

const useStyles = makeStyles()(() => ({
    modal: {
        top: "15%",
    },
}))

interface Props {
    onAccept: () => void
}

/**
 * CookieDisclaimer component displays a cookie disclaimer modal.
 *
 * @param {Props} props - Component properties.
 * @param {function} props.onAccept - Callback function triggered when the user accepts the disclaimer.
 * @returns {JSX.Element} CookieDisclaimer component.
 */
const CookieDisclaimer: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")
    const { classes } = useStyles()

    const { onAccept } = props

    return (
        <Modal isOpen={true} className={classes.modal}>
            <ModalHeader>{t("general.cookies.title")}</ModalHeader>

            <ModalBody>
                {t("general.cookies.disclaimer")}
                <br />
                <a href={config.IMPRINT_URL} target="_blank" rel="noreferrer">
                    {t("footer.imprint")}
                </a>
                &nbsp;
                <a href={config.PRIVACY_URL} target="_blank" rel="noreferrer">
                    {t("footer.privacy")}
                </a>
            </ModalBody>

            <ModalFooter>
                <CustomButton
                    text={t("general.cookies.accept")}
                    onClick={onAccept}
                />
            </ModalFooter>
        </Modal>
    )
}

export default CookieDisclaimer
