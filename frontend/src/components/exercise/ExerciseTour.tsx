// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useContext, useState } from "react"
import { makeStyles } from "tss-react/mui"
import Tour from "reactour"
import config from "../../config.json"
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

/**
 * ExerciseTour component displays a tour for the exercise page.
 * The Tour is only shown once.
 *
 * @returns {JSX.Element} Title component.
 */
const ExerciseTour: React.FC = () => {
    const { darkMode } = useContext(DarkModeContext)
    const { classes } = useStyles({ darkMode })
    const { t } = useTranslation("common")

    const [isOpen, setIsOpen] = useState(() => {
        // show tour after site is fully loaded
        setTimeout(
            () => setIsOpen(!localStorage.getItem("tour.exercise.seen")),
            800,
        )
        return false
    })

    const close = () => {
        localStorage.setItem("tour.exercise.seen", "yes")
        setIsOpen(false)
    }

    const baseTransName = "tour.exercise"
    const steps = [
        {
            selector: ".customBar", //TODO: rename class
            content: t(baseTransName + ".editor"),
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
    ]

    return (
        <Tour
            accentColor={config.THEME_COLORS.PRIMARY}
            className={classes.exerciseTour}
            steps={steps}
            isOpen={isOpen}
            onRequestClose={close}
        />
    )
}

export default ExerciseTour
