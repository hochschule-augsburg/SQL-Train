// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"

import { VisibilityContext } from "react-horizontal-scrolling-menu"
import { Link } from "react-router-dom"
import ExerciseButton from "../exercise/ExerciseButton"
import { ExerciseItem } from "../../api"
import { ExerciseEnum } from "../../store/reducers/userExercise"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    link: {
        textDecoration: "none",
    },
}))

interface Props {
    exercise: ExerciseItem
    state: ExerciseEnum
    itemId: string
    favourite: boolean
    current: number
    setBuffer: () => void
}

const Item: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    const { exercise, state, favourite, current, itemId, setBuffer } = props
    const visibility = React.useContext(VisibilityContext)

    visibility.isItemVisible(itemId)

    return (
        <Link
            id={itemId}
            to={"/topic/" + exercise.topic + "/exercise/" + exercise.enumber}
            className={classes.link}
            onClick={setBuffer}
        >
            <ExerciseButton
                text={exercise.enumber}
                exerciseState={state}
                current={current}
                marked={favourite}
            />
        </Link>
    )
}

export default Item
