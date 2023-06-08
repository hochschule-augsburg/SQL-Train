// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useContext } from "react"
import { DarkModeContext } from "../layout/DarkModeContext"
import config from "../../config.json"
import { makeStyles } from "tss-react/mui"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles<{ darkMode: boolean }>()(
    (theme, { darkMode }) => ({
        footerWrapper: {
            display: "flex",
            justifyContent: "center",
            position: "relative",
            bottom: "10px",
            width: "100%",
            paddingTop: "10px",
        },
        footerBar: {
            height: "1px",
            width: "100%",
            backgroundColor: config.THEME_COLORS.PRIMARY,
            margin: "auto",
        },
        footerLinks: {
            paddingInline: "15px",
            textDecoration: "none",
            color: darkMode
                ? config.THEME_COLORS.NEUTRAL
                : config.THEME_COLORS.DARK,
            "&:hover": {
                color: config.THEME_COLORS.PRIMARY,
            },
        },
    }),
)

/**
 * Footer component represents the footer.
 *
 * @component
 * @returns {JSX.Element} Footer component.
 */
const Footer: React.FC = () => {
    const { darkMode } = useContext(DarkModeContext)
    const { t } = useTranslation("common")
    const { classes } = useStyles({ darkMode })

    return (
        <div className={classes.footerWrapper}>
            <div className={classes.footerBar} />
            <a
                href="/privacy#imprint"
                target="_blank"
                className={classes.footerLinks}
            >
                {t("footer.imprint")}
            </a>
            <a
                href="/privacy#privacy"
                target="_blank"
                className={classes.footerLinks}
            >
                {t("footer.privacy")}
            </a>
            <a href="/credits" target="_blank" className={classes.footerLinks}>
                {t("footer.credits")}
            </a>
            <div className={classes.footerBar} />
        </div>
    )
}

export default Footer
