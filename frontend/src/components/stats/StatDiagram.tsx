// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Pie } from "react-chartjs-2"
import "chart.js/auto"
import { useTranslation } from "react-i18next"

interface Props {
    data: number[]
}

/**
 * ExerciseButton component displays a button for an exercise.
 *
 * @param {Props} props - Component properties.
 * @param {number[]} props.hoverText - Data.
 * @returns {JSX.Element} Stat component.
 */
const StatDiagram: React.FC<Props> = (props) => {
    const { data } = props
    const { t } = useTranslation("common")
    const labels = [
        "stats.correct",
        "stats.wrong",
        "stats.touched",
        "stats.untouched",
    ].map((e) => t(e))
    const colors = ["green", "red", "orange", "#333333"]

    return (
        <Pie
            data={{
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colors,
                    },
                ],
            }}
            options={{ plugins: { legend: { display: false } } }}
        />
    )
}

export default StatDiagram
