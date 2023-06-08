// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { PropsWithChildren } from "react"

interface Props {
    condition: boolean
}

/**
 * If component conditionally renders its children based on the provided condition.
 *
 * @param {Props} props - Component properties.
 * @param {boolean} props.condition - The condition to evaluate for rendering the children.
 * @returns {JSX.Element|null} Rendered content if the condition is true, otherwise null.
 */
const If: React.FC<PropsWithChildren<Props>> = (props) => {
    return props.condition ? <>{props.children}</> : <></>
}

export default If
