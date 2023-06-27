// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useContext } from "react"
import { makeStyles } from "tss-react/mui"
import { TourProvider } from "@reactour/tour"
import config from "../../../../config.json"
import { DarkModeContext } from "../layout/DarkModeContext"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles<{ darkMode: boolean }>()(
    (theme, { darkMode }) => ({
        exerciseTour: {
            // !important is needed because of the library
            backgroundColor: darkMode ? "#333!important" : "white!important",
            color: darkMode ? "white!important" : "black!important",
        },
    }),
)

interface Props {
    children: any
}

/**
 * ExerciseTour component displays a tour for the exercise page.
 * The Tour is only shown once.
 *
 * @returns {JSX.Element} Title component.
 */
const ExerciseTour: React.FC<Props> = (props) => {
    const { darkMode } = useContext(DarkModeContext)
    const { classes } = useStyles({ darkMode })
    const { t } = useTranslation("common")

    const close = () => {
        localStorage.setItem("tour.exercise.seen", "yes")
    }

    const baseTransName = "tour.exercise"
    const steps = [
        {
            selector: "#question",
            content: t(baseTransName + ".question"),
        },
        {
            selector: "#editor",
            content: t(baseTransName + ".editor"),
        },
        {
            selector: "#dataModelIcon",
            content: t(baseTransName + ".datamodel"),
        },
        {
            selector: "#execute",
            content: t(baseTransName + ".execute"),
        },
        {
            selector: "#check",
            content: t(baseTransName + ".check"),
        },
        {
            selector: "#solution",
            content: t(baseTransName + ".solution"),
        },
        {
            selector: "#prevBut",
            content: t(baseTransName + ".prev"),
        },
        {
            selector: "#nextBut",
            content: t(baseTransName + ".next"),
        },
        {
            selector: "#reset",
            content: t(baseTransName + ".reset"),
        },
        {
            selector: "#clear",
            content: t(baseTransName + ".clear"),
        },
        {
            selector: ".table",
            content: t(baseTransName + ".table"),
        },
    ]

    return (
        <TourProvider
            styles={{
                popover: (base) => ({
                    ...base,
                    "--reactour-accent": config.THEME_COLORS.PRIMARY,
                    borderRadius: "5px",
                }),
                arrow: (base) => ({
                    ...base,
                    color: config.THEME_COLORS.PRIMARY,
                }),
                close: (base) => ({
                    ...base,
                    color: config.THEME_COLORS.PRIMARY,
                }),
            }}
            className={classes.exerciseTour}
            steps={steps}
            beforeClose={close}
        >
            {props.children}
        </TourProvider>
    )
}

export default ExerciseTour
