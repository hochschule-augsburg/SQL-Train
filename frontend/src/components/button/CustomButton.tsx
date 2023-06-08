// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Button } from "reactstrap"
import { makeStyles } from "tss-react/mui"
import config from "../../config.json"

const useStyles = makeStyles<{
    buttonWidth: string | undefined
    selected: boolean | undefined
}>()((theme, { buttonWidth, selected }) => ({
    wrapper: {
        display: "flex",
        justifyContent: "center",
    },
    button: {
        backgroundColor: config.THEME_COLORS.SECONDARY,
        paddingRight: "20px",
        paddingLeft: "20px",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "5px",
        marginBottom: "5px",
        borderWidth: "2px",
        borderColor: selected
            ? config.THEME_COLORS.PRIMARY
            : config.THEME_COLORS.NEUTRAL,
        width: buttonWidth,
    },
}))

interface Props {
    className?: string
    width?: string
    text: string
    id?: string
    selected?: boolean
    onClick?: () => void
}

/**
 * CustomButton component displays a custom styled button.
 *
 * @param {Props} props - Component properties.
 * @param {string} [props.className] - Additional CSS class for the button.
 * @param {string} [props.width] - Width of the button.
 * @param {string} props.text - Text to display on the button.
 * @param {string} [props.id] - ID attribute for the button.
 * @param {function} [props.onClick] - Callback function triggered when the button is clicked.
 * @returns {JSX.Element} CustomButton component.
 */
const CustomButton: React.FC<Props> = (props) => {
    const { onClick, text, width, id, selected } = props

    const { classes, cx } = useStyles({
        buttonWidth: width,
        selected: selected,
    })

    return (
        <div className={classes.wrapper}>
            <Button
                onClick={onClick}
                className={cx(classes.button, props.className)}
                id={id}
                size="sm"
            >
                {text}
            </Button>
        </div>
    )
}

export default CustomButton
