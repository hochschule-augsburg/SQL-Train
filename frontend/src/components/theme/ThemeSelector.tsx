// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { makeStyles } from "tss-react/mui"
import { DarkModeContext } from "../layout/DarkModeContext"
import { Menu, MenuItem } from "@mui/material"
import config from "../../../../config.json"
import { NavItem } from "reactstrap"

const useStyles = makeStyles<{ darkMode: boolean }>()(
    (theme, { darkMode }) => ({
        dropdownToggle: {
            backgroundColor: "transparent",
            borderWidth: "0px",
            "&:hover": {
                backgroundColor: "transparent",
                // color: config.THEME_COLORS.NEUTRAL,
            },
        },
        dropdownItem: {
            backgroundColor: darkMode
                ? config.THEME_COLORS.DARK
                : config.THEME_COLORS.NEUTRAL,
            color: darkMode ? config.THEME_COLORS.NEUTRAL : "black",
        },
    }),
)

/**
 * ThemeSelector component provides a dropdown to select the color scheme.
 *
 * @component
 * @returns {JSX.Element} ThemeSelector component.
 */
const ThemeSelector: React.FC = () => {
    const { t } = useTranslation("common")
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext)
    const { classes, cx } = useStyles({ darkMode })

    const [selTheme, setSelTheme] = useState<string>(
        localStorage.getItem("theme") ?? "auto",
    )
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (e: React.MouseEvent<HTMLLIElement>) => {
        const { theme } = e.currentTarget.dataset
        if (theme) {
            setSelTheme(theme)
            changeTheme(theme)
        }
        setAnchorEl(null)
    }
    /**
     * changeTheme function changes the color scheme in the application.
     *
     * @param {string} color - Name of the new color scheme.
     * @returns {Promise<void>} Promise that resolves after the theme is changed.
     */
    const changeTheme = useCallback(
        async (theme: string) => {
            toggleDarkMode(theme)
        },
        [toggleDarkMode],
    )

    const themeOptions = [
        {
            class: "bi bi-circle-half",
            theme: "auto",
            label: t("general.theme.auto"),
        },
        {
            class: "bi bi-sun-fill",
            theme: "light",
            label: t("general.theme.light"),
        },
        {
            class: "bi bi-moon-fill",
            theme: "dark",
            label: t("general.theme.dark"),
        },
    ]

    const getIconClass = (theme: string): string => {
        const selectedOption = themeOptions.find(
            (option) => option.theme === theme,
        )
        if (selectedOption) {
            return selectedOption.class
        }
        return ""
    }

    return (
        <NavItem>
            <i
                className={cx(getIconClass(selTheme))}
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
                {themeOptions.map((option) => (
                    <MenuItem
                        data-theme={option.theme}
                        key={option.theme}
                        selected={option.theme === selTheme}
                        onClick={handleClose}
                        className={classes.dropdownItem}
                    >
                        <i className={option.class}></i>&nbsp;{option.label}
                    </MenuItem>
                ))}
            </Menu>
        </NavItem>
    )
}

export default ThemeSelector
