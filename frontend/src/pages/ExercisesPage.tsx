// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useContext, useEffect, useState } from "react"
import Title from "../components/exercise/Title"
import { useHistory, useParams } from "react-router-dom"
import { ExerciseItem, Favourite } from "../api"
import { makeStyles } from "tss-react/mui"
import ExerciseButton from "../components/exercise/ExerciseButton"
import AnimatedDiv from "../components/animation/AnimatedDiv"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../store/reducers/Store"
import { fetchExercises } from "../store/reducers/exercise"
import {
    ExerciseEnum,
    fetchUserExercises,
} from "../store/reducers/userExercise"
import { fetchTopic } from "../store/reducers/topic"
import { fetchFavourites } from "../store/reducers/favourite"
import { DefaultApi } from "../api"
import { apiExec, hasFailed } from "../utils/ApiUtils"
import { useTranslation } from "react-i18next"
import { ErrorContext } from "../components/layout/ErrorContext"
import { validateTopicFromURL } from "../utils/ExerciseUtils"

const useStyles = makeStyles()(() => ({
    divWrapper: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginInline: "10%",
    },
    buttonDiv: {
        textDecoration: "none",
    },
}))

type ExercisesPageParams = {
    topicId: string
}

/**
 * ExercisesPage component represents the exercises page.
 *
 * @component
 * @returns {JSX.Element} ExercisesPage component.
 */
const ExercisesPage: React.FC = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const { t } = useTranslation("common")
    const { setError } = useContext(ErrorContext)

    const { classes } = useStyles()

    const topicId = validateTopicFromURL(
        useParams<ExercisesPageParams>().topicId,
    )

    const exercises = useSelector((state: RootState) => state.exercises)
    const userExercises = useSelector((state: RootState) => state.userExercises)
    const topic = useSelector((state: RootState) => state.topic.selectedTopic)
    const favourite = useSelector(
        (state: RootState) => state.favourite.favourites,
    )

    const [transSwitch, setTransSwitch] = useState<boolean>(true)
    const [favouriteExercises, setFavouriteExercises] = useState<
        Favourite[] | undefined
    >(undefined)

    /**
     * setupDB function checks or installs the exercise database.
     *
     * @returns {void} The function does not return a value.
     */
    const setupDB = useCallback(async () => {
        const response = await apiExec(DefaultApi, (api) =>
            api.pgStudApiCheckOrInstallDb({ topic_short: topicId, enumber: 0 }),
        )
        if (hasFailed(response)) {
            if (response.error.message) {
                return setError(
                    t("general.error.message", {
                        message: response.error.message,
                    }),
                )
            }
            return setError(t("general.error.user_db"))
        }
    }, [setError, t, topicId])

    useEffect(() => {
        setupDB()
        dispatch(fetchExercises(topicId)).catch(() =>
            setError(t("general.error.exercise")),
        )
        dispatch(fetchUserExercises(topicId)).catch(() =>
            setError(t("general.error.user_exercise")),
        )
        dispatch(fetchTopic(topicId)).catch(() =>
            setError(t("general.error.topic")),
        )
        dispatch(fetchFavourites()).catch(() =>
            setError(t("general.error.favourite")),
        )
    }, [dispatch, setError, setupDB, t, topicId])

    useEffect(() => {
        setFavouriteExercises(
            favourite.filter((e) => e.topic_short === topicId),
        )
    }, [favourite, topicId])

    /**
     * buttonClickHandler function handles the logic when a button is clicked.
     *
     * @param {number} exerciseId - The ID of the exercise.
     * @returns {void} The function does not return a value.
     */
    const buttonClickHandler = useCallback(
        (exerciseId: number) => {
            setTransSwitch((t) => !t)
            setTimeout(() => {
                history.push("/topic/" + topicId + "/exercise/" + exerciseId)
            }, 200)
        },
        [history, topicId],
    )

    /**
     * getExerciseState function retrieves the state of an exercise.
     *
     * @param {ExerciseItem} exercise - The exercise object.
     * @returns {ExerciseEnum} The state of the exercise.
     */
    const getExerciseState = useCallback(
        (exercise: ExerciseItem) => {
            if (exercise.id === undefined) {
                return ExerciseEnum.DEFAULT
            }
            const exerciseState = userExercises.userExerciseState.find(
                (e) => e.id === exercise.id,
            )
            return exerciseState ? exerciseState.state : ExerciseEnum.DEFAULT
        },
        [userExercises.userExerciseState],
    )

    if (!topicId) {
        return <></>
    }

    return (
        <AnimatedDiv transSwitch={transSwitch}>
            <div>
                <Title text={topic?.title} />
                <div className={classes.divWrapper}>
                    {exercises.exercises.map((exercise) => {
                        const exerciseState = getExerciseState(exercise)
                        return (
                            <div
                                className={classes.buttonDiv}
                                key={exercise.enumber}
                                onClick={() =>
                                    buttonClickHandler(exercise.enumber)
                                }
                            >
                                <ExerciseButton
                                    current={undefined}
                                    text={exercise.enumber}
                                    exerciseState={exerciseState}
                                    marked={
                                        favouriteExercises?.some(
                                            (e) =>
                                                e.enumber == exercise.enumber,
                                        ) || false
                                    }
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </AnimatedDiv>
    )
}

export default ExercisesPage
