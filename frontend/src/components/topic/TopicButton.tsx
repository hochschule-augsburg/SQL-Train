// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Button } from "reactstrap"
import config from "../../../../config.json"
import { makeStyles } from "tss-react/mui"
import If from "../conditional/If"

const useStyles = makeStyles()(() => ({
    wrapper: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
    },
    button: {
        backgroundColor: config.THEME_COLORS.SECONDARY,
        marginLeft: "10px",
        marginRight: "10px",
        marginBottom: "10px",
        borderWidth: "1px",
        borderColor: config.THEME_COLORS.NEUTRAL,
    },
    buttonText: {
        marginTop: "5px",
    },
    topicBadge: {
        paddingInline: "3px",
        borderStyle: "solid",
        borderRadius: "4px",
        borderWidth: "2px",
        fontWeight: "bold",
        fontSize: "11px",
        color: config.THEME_COLORS.SECONDARY,
        borderColor: config.THEME_COLORS.SECONDARY,
        backgroundColor: config.THEME_COLORS.NEUTRAL,
        top: "-10%",
        right: "0%",
        transform: "translateX(20%)",
        position: "absolute",
    },
}))

interface Props {
    text: string
    tag?: string
    id: string
    onClick?: () => void
}

/**
 * TopicButton component represents a topic button in the topic list.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {string} props.text - Text to be displayed on the button.
 * @param {number} props.difficulty - Difficulty level of the topic.
 * @param {string} props.id - Unique ID for the topic.
 * @param {Function} [props.onClick] - Function to be called when the button is clicked.
 * @returns {JSX.Element} TopicButton component.
 */
const TopicButton: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    const { onClick, text, id, tag } = props

    return (
        <div className={classes.wrapper}>
            <Button
                onClick={onClick}
                className={classes.button}
                size="lg"
                id={id}
            >
                <h4 className={classes.buttonText}>{text}</h4>
            </Button>
            <If condition={tag !== null}>
                <div className={classes.topicBadge}>{tag}</div>
            </If>
        </div>
    )
}

export default TopicButton
