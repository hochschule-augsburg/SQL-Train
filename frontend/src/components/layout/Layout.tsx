// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useContext, useEffect, useState } from "react"
import NavBar from "../navbar/NavBar"
import Router from "./Router"
import { DarkModeContext } from "./DarkModeContext"
import config from "../../../../config.json"
import i18next from "i18next"
import CookieDisclaimer from "../dialog/CookieDisclaimer"
import If from "../conditional/If"
import { makeStyles } from "tss-react/mui"
import AnimatedDiv from "../animation/AnimatedDiv"
import { useSelector } from "react-redux"
import { fetchUserdata } from "../../store/reducers/user"
import { RootState, useAppDispatch } from "../../store/reducers/Store"
import Footer from "../footer/footer"
import { useTranslation } from "react-i18next"
import { ErrorContext } from "./ErrorContext"

const useStyles = makeStyles<{ darkMode: boolean }>()(
    (theme, { darkMode }) => ({
        root: {
            height: "100vh",
            width: "100vw",
            overflow: "auto",
            backgroundColor: darkMode
                ? config.THEME_COLORS.DARK
                : config.THEME_COLORS.NEUTRAL,
        },
        routerDiv: {
            minHeight: "calc(100vh - (59px + 34px))",
        },
    }),
)

/**
 * Layout component represents the main layout of the application.
 *
 * @component
 * @returns {JSX.Element} Layout component.
 */
const Layout: React.FC = () => {
    const { darkMode } = useContext(DarkModeContext)
    const { setError } = useContext(ErrorContext)

    const { classes } = useStyles({ darkMode })
    const { t } = useTranslation("common")

    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)

    const [sqlSwitch, setSqlSwitch] = useState<boolean>(false)
    const [transSwitch, setTransSwitch] = useState<boolean>(true)
    const [cookiesAccepted, setCookiesAccpeted] = useState(
        localStorage.getItem("cookies") === "yes",
    )

    /**
     * onAccept function sets the cookies acceptance in the local storage and updates the state.
     *
     * @returns {void} The function does not return a value.
     */
    const onAccept = useCallback(() => {
        localStorage.setItem("cookies", "yes")
        setCookiesAccpeted(true)
    }, [])

    /**
     * changeLanguage function changes the language in the application and refreshes the page.
     *
     * @param {string} language - Language code.
     * @returns {Promise<void>} Promise that resolves after the language is changed and the page is refreshed.
     */
    const changeLanguage = useCallback(async (language: string) => {
        if (!window.localStorage.getItem("language")) {
            window.localStorage.setItem("language", language)
            await i18next.changeLanguage(language)
            window.location.reload()
        }
    }, [])

    useEffect(() => {
        dispatch(fetchUserdata()).catch(() =>
            setError(t("general.error.userdata")),
        )
        user.userdata?.course_locale &&
            changeLanguage(
                user.userdata.course_locale.toLocaleUpperCase() as string,
            )
    }, [dispatch, changeLanguage, user.userdata?.course_locale, t, setError])

    useEffect(() => {
        setTransSwitch((t) => !t)
        setTimeout(() => {
            setTransSwitch((t) => !t)
        }, 200)
    }, [sqlSwitch])

    return (
        <div className={classes.root}>
            <If condition={!cookiesAccepted}>
                <CookieDisclaimer onAccept={onAccept} />
            </If>
            <NavBar animateHandler={() => setSqlSwitch((t) => !t)} />
            <div className={classes.routerDiv}>
                <AnimatedDiv transSwitch={transSwitch}>
                    <Router />
                </AnimatedDiv>
            </div>
            <Footer />
        </div>
    )
}

export default Layout
