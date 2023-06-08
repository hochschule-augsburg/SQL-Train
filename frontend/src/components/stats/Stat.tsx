// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from "react"
import { Button } from "reactstrap"
import { makeStyles } from "tss-react/mui"
import config from "../../config.json"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles<{ label: { color: string; text: string } }>()(
    (theme, { label }) => ({
        button: {
            padding: "0px",
            backgroundColor: config.THEME_COLORS.SECONDARY,
            width: "65px",
            height: "65px",
            marginLeft: "25px",
            marginRight: "25px",
            marginTop: "12px",
            marginBottom: "12px",
            borderWidth: "2px",
            borderColor: config.THEME_COLORS.NEUTRAL,
        },
        wrapper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        relative: {
            position: "relative",
        },
        topicBadge: {
            paddingInline: "3px",
            borderStyle: "solid",
            borderRadius: "4px",
            borderWidth: "2px",
            fontWeight: "bold",
            fontSize: "11px",
            color: config.THEME_COLORS.NEUTRAL,
            borderColor: config.THEME_COLORS.NEUTRAL,
            backgroundColor: label.color,
            top: "0%",
            right: "0%",
            transform: "translateX(20%)",
            position: "absolute",
        },
    }),
)

interface Props {
    text: number | undefined
    hoverText: number | undefined
    label: { color: string; text: string }
}

/**
 * ExerciseButton component displays a button for an exercise.
 *
 * @param {Props} props - Component properties.
 * @param {number} props.text - The text to display on the button.
 * @param {number} props.hoverText - The text to display on the button on hover.
 * @param {number} props.label - The badge text and color.
 * @returns {JSX.Element} Stat component.
 */
const Stat: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")
    const { text, hoverText, label } = props
    const { classes } = useStyles({ label })
    const [hover, setHover] = useState<boolean>(false)

    return (
        <div className={classes.wrapper}>
            <div className={classes.relative}>
                <Button
                    className={classes.button}
                    size="lg"
                    onMouseOver={() => setHover(true)}
                    onMouseOut={() => setHover(false)}
                >
                    <h4>
                        {hover
                            ? hoverText
                            : text && text >= 0 && text <= 100
                            ? `${text?.toString()}%`
                            : "-"}
                    </h4>
                </Button>
                <div className={classes.topicBadge}>{t(label.text)}</div>
            </div>
        </div>
    )
}

export default Stat
