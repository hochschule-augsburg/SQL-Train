// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useState, useContext } from "react"
import i18next from "i18next"
import { useTranslation } from "react-i18next"
import { makeStyles } from "tss-react/mui"
import { DarkModeContext } from "../layout/DarkModeContext"
import config from "../../../../config.json"
import { Menu, MenuItem } from "@mui/material"
import { NavItem } from "reactstrap"

const useStyles = makeStyles<{ darkMode: boolean }>()(
    (theme, { darkMode }) => ({
        dropdownItem: {
            backgroundColor: darkMode
                ? config.THEME_COLORS.DARK
                : config.THEME_COLORS.NEUTRAL,
            color: darkMode ? config.THEME_COLORS.NEUTRAL : "black",
        },
    }),
)

/**
 * LanguageSelector component provides a dropdown to select the language.
 *
 * @component
 * @returns {JSX.Element} LanguageSelector component.
 */
const LanguageSelector: React.FC = () => {
    const { t } = useTranslation("common")
    const { darkMode } = useContext(DarkModeContext)

    const { classes, cx } = useStyles({ darkMode })

    const [selLang, setSelLang] = useState<string>(
        localStorage.getItem("language") ?? "DE",
    )
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (e: React.MouseEvent<HTMLLIElement>) => {
        const { lang } = e.currentTarget.dataset
        if (lang) {
            setSelLang(lang)
            changeLanguage(lang)
        }
        setAnchorEl(null)
    }

    /**
     * changeLanguage function changes the language in the application and refreshes the page.
     *
     * @param {string} language - Language code.
     * @returns {Promise<void>} Promise that resolves after the language is changed and the page is refreshed.
     */
    const changeLanguage = useCallback(async (language: string) => {
        localStorage.setItem("language", language)
        await i18next.changeLanguage(language)
        window.location.reload()
    }, [])

    const languageOptions = [
        {
            code: "EN",
            label: t("general.language.english"),
        },
        {
            code: "DE",
            label: t("general.language.german"),
        },
    ]

    return (
        <NavItem>
            <i
                className={cx("bi bi-globe")}
                onClick={handleClick}
                aria-label="Theme Selector"
                role="button"
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: darkMode
                            ? config.THEME_COLORS.DARK
                            : config.THEME_COLORS.NEUTRAL,
                        border: darkMode
                            ? "solid 1px white"
                            : "solid 1px black",
                    },
                }}
            >
                {languageOptions.map((option) => (
                    <MenuItem
                        data-lang={option.code}
                        key={option.code}
                        selected={option.code === selLang}
                        onClick={handleClose}
                        className={classes.dropdownItem}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </NavItem>
    )
}

export default LanguageSelector
