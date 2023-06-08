// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { PropsWithChildren } from "react"
import { animated, useTransition } from "@react-spring/web"

interface Props {
    transSwitch: boolean
}

/**
 * AnimatedDiv component animates the display of its children using react-spring transitions.
 *
 * @param {Props} props - Component properties.
 * @param {boolean} props.transSwitch - Indicates whether to trigger the transition animation.
 * @returns {JSX.Element} AnimatedDiv component.
 */
const AnimatedDiv: React.FC<PropsWithChildren<Props>> = (props) => {
    const { transSwitch } = props

    const transition = useTransition(transSwitch, {
        config: { duration: 200 },
        from: { scale: 0.5, opacity: -0.5 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 0.5, opacity: -0.5 },
    })

    return transition(
        (style, item) =>
            item && <animated.div style={style}>{props.children}</animated.div>,
    )
}

export default AnimatedDiv
