// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react"

export type DarkMode = {
    darkMode: boolean
    toggleDarkMode: (color: string) => void
}

export const DarkModeContext = createContext<DarkMode>({
    darkMode: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toggleDarkMode: () => {},
})

/**
 * DarkModeProvider component provides a context for managing dark mode state.
 *
 * @component
 * @param {PropsWithChildren} props - Component properties with children.
 * @returns {JSX.Element} DarkModeProvider component.
 */
export const DarkModeProvider: React.FC<PropsWithChildren> = (props) => {
    const [autoDarkMode, setAutoDarkMode] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        switch (localStorage.getItem("theme")) {
            case undefined:
            case "auto":
                setAutoDarkMode(true)
                return window?.matchMedia("(prefers-color-scheme: dark)")
                    .matches
            default:
                setAutoDarkMode(false)
                return localStorage.getItem("theme") === "dark"
        }
    })

    /**
     * toggleDarkMode function toggles the dark mode in the application and updates the theme in local storage.
     *
     * @returns {void} The function does not return a value.
     */
    const toggleDarkMode = useCallback((color: string) => {
        localStorage.setItem("theme", color)
        if (color === "auto") {
            setAutoDarkMode(true)
            setDarkMode(
                window?.matchMedia("(prefers-color-scheme: dark)").matches,
            )
        } else {
            setAutoDarkMode(false)
            setDarkMode(color === "dark")
        }
    }, [])

    useEffect(() => {
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleDarkModeChange = (e: MediaQueryListEvent) => {
            if (autoDarkMode) {
                setDarkMode(e.matches)
            }
        }

        darkModeQuery.addEventListener("change", handleDarkModeChange)

        return () => {
            darkModeQuery.removeEventListener("change", handleDarkModeChange)
        }
    }, [autoDarkMode])

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {props.children}
        </DarkModeContext.Provider>
    )
}
