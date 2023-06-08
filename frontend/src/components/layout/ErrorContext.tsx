// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, PropsWithChildren, useState } from "react"
import { Toast } from "../info/Toast"

export type Error = {
    error: string | null
    setError: (error: string | null) => void
}

export const ErrorContext = createContext<Error>({
    error: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setError: () => {},
})

/**
 * DarkModeProvider component provides a context for managing dark mode state.
 *
 * @component
 * @param {PropsWithChildren} props - Component properties with children.
 * @returns {JSX.Element} DarkModeProvider component.
 */
export const ErrorProvider: React.FC<PropsWithChildren> = (props) => {
    const [error, setError] = useState<string | null>(null)

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            <Toast message={error} onClose={() => setError(null)} />
            {props.children}
        </ErrorContext.Provider>
    )
}
