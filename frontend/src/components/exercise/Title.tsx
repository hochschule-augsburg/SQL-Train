// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import config from "../../config.json"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    wrapper: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "5%",
        marginBottom: "3%",
    },
    span: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: config.THEME_COLORS.SECONDARY,
        padding: "20px",
        borderRadius: "4px",
        lineHeight: "1",
        borderWidth: "1px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        borderStyle: "solid",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        color: config.THEME_COLORS.NEUTRAL,
        margin: "0px",
    },
}))

interface Props {
    text: string | undefined
}

/**
 * Title component displays a title with text.
 *
 * @param {Props} props - Component properties.
 * @param {string | undefined} props.text - The text to display as the title.
 * @returns {JSX.Element} Title component.
 */
const Title: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    const { text } = props

    return (
        <div className={classes.wrapper}>
            <span className={classes.span}>
                <h2 className={classes.header}>{text}</h2>
            </span>
        </div>
    )
}

export default Title
