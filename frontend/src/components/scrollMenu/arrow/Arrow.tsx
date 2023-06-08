// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useContext } from "react"
import { VisibilityContext } from "react-horizontal-scrolling-menu"
import config from "../../../config.json"
import { DarkModeContext } from "../../layout/DarkModeContext"

/**
 * LeftArrow component represents the left arrow button.
 *
 * @component
 * @returns {JSX.Element} LeftArrow component.
 */
export const LeftArrow: React.FC = () => {
    const { isFirstItemVisible, scrollPrev } =
        React.useContext(VisibilityContext)

    return (
        <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
            &lt;
        </Arrow>
    )
}

/**
 * RightArrow component represents the right arrow button.
 *
 * @component
 * @returns {JSX.Element} RightArrow component.
 */
export const RightArrow: React.FC = () => {
    const { isLastItemVisible, scrollNext } =
        React.useContext(VisibilityContext)

    return (
        <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
            &gt;
        </Arrow>
    )
}

/**
 * Arrow component represents a generic arrow button.
 *
 * @component
 * @param {ArrowProps} props - The arrow component props.
 * @returns {JSX.Element} Arrow component.
 */
const Arrow: React.FC<ArrowProps> = (props: ArrowProps) => {
    const { children, disabled, onClick } = props
    const { darkMode } = useContext(DarkModeContext)

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            style={{
                border: "none",
                backgroundColor: "transparent",
                fontWeight: "bold",
                color: darkMode
                    ? config.THEME_COLORS.NEUTRAL
                    : config.THEME_COLORS.DARK,
            }}
        >
            {children}
        </button>
    )
}

type ArrowProps = {
    children: React.ReactNode
    disabled: boolean
    onClick: any
}
