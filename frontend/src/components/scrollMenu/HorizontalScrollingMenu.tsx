// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useContext, useEffect, useRef } from "react"
import "react-horizontal-scrolling-menu/dist/styles.css"
import "./HorizontalScrollingMenu.css"
import { useParams } from "react-router-dom"
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu"
import { LeftArrow, RightArrow } from "./arrow/Arrow"
import { Exercise, ExerciseItem } from "../../api"
import { makeStyles } from "tss-react/mui"
import { RootState, useAppDispatch } from "../../store/reducers/Store"
import { fetchExercises } from "../../store/reducers/exercise"
import { useSelector } from "react-redux"
import {
    ExerciseEnum,
    ExerciseStateType,
} from "../../store/reducers/userExercise"
import Item from "./ScrollItem"
import { useTranslation } from "react-i18next"
import { ErrorContext } from "../layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    horizontalMenu: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "3%",
        marginBottom: "1%",
    },
    widthWrapper: {
        width: "60%",
    },
}))

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>

type HorizontalScrollingMenuParams = {
    topicId: string
}

interface Props {
    setBuffer: () => void
    exerciseStates: ExerciseStateType[]
    current: number
    natural: boolean
}

/**
 * HorizontalScrollingMenu component represents a horizontal scrolling menu of exercises.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {Function} props.setBuffer - Function to set the buffer.
 * @param {ExerciseStateType[]} props.exerciseStates - Array of exercise states.
 * @param {number} props.current - Current exercise number.
 * @returns {JSX.Element} HorizontalScrollingMenu component.
 */
const HorizontalScrollingMenu: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const { t } = useTranslation("common")
    const { setError } = useContext(ErrorContext)

    const dispatch = useAppDispatch()
    const { topicId } = useParams<HorizontalScrollingMenuParams>()

    const { exerciseStates, setBuffer, current } = props

    const exercises = useSelector(
        (state: RootState) => state.exercises.exercises,
    )
    const selExercise = useSelector(
        (state: RootState) => state.exercises.selectedExercise,
    )
    const favs = useSelector((state: RootState) => state.favourite)

    const scrollMenu = useRef({} as scrollVisibilityApiType)

    useEffect(() => {
        dispatch(fetchExercises(topicId)).catch(() =>
            setError(t("general.error.exercise")),
        )
    }, [dispatch, topicId, favs, t, setError])

    /**
     * getExerciseState function retrieves the state of an exercise.
     *
     * @param {Exercise} exercise - The exercise object.
     * @returns {ExerciseEnum} The state of the exercise.
     */
    const getExerciseState = useCallback(
        (exercise: Exercise | ExerciseItem) => {
            if (props.natural) {
                return ExerciseEnum.WRONG
            }
            if (exercise.id === undefined) {
                return ExerciseEnum.DEFAULT
            }
            const exerciseState = exerciseStates.find(
                (e) => e.id === exercise.id,
            )
            return exerciseState ? exerciseState.state : ExerciseEnum.DEFAULT
        },
        [exerciseStates, props.natural],
    )

    const menuItemId = "menuItem"

    useEffect(() => {
        const item = scrollMenu.current.getItemElementById(
            `${menuItemId}:${selExercise?.topic}/${selExercise?.enumber}`,
        )
        if (item) {
            scrollMenu.current.scrollToItem(item, "smooth", "center", "nearest")
        }
    }, [selExercise])

    if (!topicId) {
        return <></>
    }

    return (
        <div className={classes.horizontalMenu}>
            <div className={classes.widthWrapper}>
                <ScrollMenu
                    apiRef={scrollMenu}
                    LeftArrow={LeftArrow}
                    RightArrow={RightArrow}
                >
                    {exercises.map((exercise) => {
                        const exerciseState = getExerciseState(exercise)
                        return (
                            <Item
                                itemId={`${menuItemId}:${exercise.topic}/${exercise.enumber}`}
                                key={`${menuItemId}:${exercise.topic}/${exercise.enumber}`}
                                exercise={exercise}
                                current={current}
                                state={exerciseState}
                                favourite={
                                    favs?.favourites.some(
                                        (e) =>
                                            e.enumber == exercise.enumber &&
                                            e.topic_short == exercise.topic,
                                    ) || false
                                }
                                setBuffer={setBuffer}
                            />
                        )
                    })}
                </ScrollMenu>
            </div>
        </div>
    )
}

export default HorizontalScrollingMenu
