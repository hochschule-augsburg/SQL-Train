// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Provider } from "react-redux"
import { store } from "../../store/reducers/Store"
import i18next from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"
import Layout from "./Layout"
import React, { useMemo } from "react"
import { DarkModeProvider } from "./DarkModeContext"
import { ErrorProvider } from "./ErrorContext"

/**
 * App component serves as the entry point of the application.
 *
 * @component
 * @returns {JSX.Element} App component.
 */
const App: React.FC = () => {
    const language = useMemo(() => {
        return window.localStorage.getItem("language")
            ? window.localStorage.getItem("language")
            : "DE"
    }, [])

    /**
     * fetchEnglish function fetches the English language package and initializes i18next.
     *
     * @param {string} defaultJsonFile - The German language package.
     */
    const fetchEnglish = async (defaultJsonFile: string) => {
        const result = await fetch("static/locales/EN/common.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        initI18(defaultJsonFile, await result.json())
    }

    fetch("static/locales/DE/common.json", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((response) => {
            return response.json()
        })
        .then((defaultJsonFile) => {
            fetchEnglish(defaultJsonFile)
        })
        .catch((err) => {
            console.log(err)
        })

    /**
     * initI18 function initializes i18next with language packages.
     *
     * @param {string} germanPackage - The German language package.
     * @param {string} englishPackage - The English language package.
     */
    const initI18 = (germanPackage: string, englishPackage: string) => {
        i18next.use(initReactI18next).init({
            interpolation: { escapeValue: false },
            returnNull: true,
            lng: language ?? "DE",
            resources: {
                DE: {
                    common: germanPackage,
                },
                EN: {
                    common: englishPackage,
                },
            },
        })
    }

    return (
        <ErrorProvider>
            <I18nextProvider i18n={i18next}>
                <DarkModeProvider>
                    <Provider store={store}>
                        <Layout />
                    </Provider>
                </DarkModeProvider>
            </I18nextProvider>
        </ErrorProvider>
    )
}

export default App
