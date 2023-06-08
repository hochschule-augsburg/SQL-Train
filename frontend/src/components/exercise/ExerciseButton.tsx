// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Button } from "reactstrap"
import { makeStyles } from "tss-react/mui"
import config from "../../config.json"
import If from "../conditional/If"
import { ExerciseEnum } from "../../store/reducers/userExercise"

const useStyles = makeStyles<{
    exerciseState: ExerciseEnum
    current: number | undefined
    text: number
}>()((theme, { exerciseState, current, text }) => ({
    button: {
        padding: "0px",
        backgroundColor: config.THEME_COLORS.SECONDARY,
        width: "65px",
        height: "65px",
        marginLeft: "15px",
        marginRight: "15px",
        marginTop: "12px",
        marginBottom: "12px",
        borderWidth: "2px",
        borderColor:
            current === text
                ? config.THEME_COLORS.PRIMARY
                : config.THEME_COLORS.NEUTRAL,
    },
    buttonText: {
        marginTop: "5px",
        color:
            exerciseState === ExerciseEnum.CORRECT
                ? "#27ff00"
                : exerciseState === ExerciseEnum.WRONG
                ? "red"
                : "",
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
    },
    relative: {
        position: "relative",
    },
    star: {
        position: "absolute",
        top: "14px",
        right: "20px",
        fontSize: "11px",
        color: config.THEME_COLORS.PRIMARY,
    },
}))

interface Props {
    text: number
    onClick?: () => void
    exerciseState: ExerciseEnum
    marked: boolean
    current: number | undefined
}

/**
 * ExerciseButton component displays a button for an exercise.
 *
 * @param {Props} props - Component properties.
 * @param {number} props.text - The text to display on the button.
 * @param {function} [props.onClick] - Callback function for button click event.
 * @param {ExerciseEnum} props.exerciseState - State of the exercise.
 * @param {boolean} props.marked - Flag indicating whether the exercise is marked.
 * @param {number | undefined} props.current - Current exercise number.
 * @returns {JSX.Element} ExerciseButton component.
 */
const ExerciseButton: React.FC<Props> = (props) => {
    const { onClick, text, exerciseState, current, marked } = props

    const { classes, cx } = useStyles({ exerciseState, current, text })

    return (
        <div className={classes.wrapper}>
            <div className={classes.relative}>
                <Button onClick={onClick} className={classes.button} size="lg">
                    <h4 className={classes.buttonText}>{text}</h4>
                </Button>

                <If condition={marked}>
                    <i className={cx("bi bi-star-fill", classes.star)} />
                </If>
            </div>
        </div>
    )
}

export default ExerciseButton
