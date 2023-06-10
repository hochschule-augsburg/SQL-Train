// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useContext, useEffect, useState } from "react"
import Title from "../exercise/Title"
import { useHistory } from "react-router-dom"
import { makeStyles } from "tss-react/mui"
import ExerciseButton from "../exercise/ExerciseButton"
import AnimatedDiv from "../animation/AnimatedDiv"
import { useAppDispatch } from "../../store/reducers/Store"
import { mapStateToEnum } from "../../store/reducers/userExercise"
import { fetchFavourites } from "../../store/reducers/favourite"
import { DefaultApi } from "../../api"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { useTranslation } from "react-i18next"
import { TopicExercise, Favourite } from "../../api"
import { RootState } from "../../store/reducers/Store"
import { useSelector } from "react-redux"
import { ErrorContext } from "../layout/ErrorContext"

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

interface props {
    topic: TopicExercise
}

const Results: React.FC<props> = (props) => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const { t } = useTranslation("common")
    const { setError } = useContext(ErrorContext)

    const { classes } = useStyles()

    const topicId = props.topic.topic_short

    const exercises = props.topic.exercises
    const favourite = useSelector(
        (state: RootState) => state.favourite.favourites,
    )
    const [favouriteExercises, setFavouriteExercises] = useState<
        Favourite[] | undefined
    >(undefined)

    const [transSwitch, setTransSwitch] = useState<boolean>(true)

    useEffect(() => {
        setFavouriteExercises(
            favourite.filter((e) => e.topic_short === topicId),
        )
    }, [favourite, topicId])

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
        dispatch(fetchFavourites()).catch(() =>
            setError(t("general.error.favourite")),
        )
    }, [dispatch, setupDB, topicId, t, setError])

    const buttonClickHandler = useCallback(
        (exerciseId: number) => {
            setTransSwitch((t) => !t)
            setTimeout(() => {
                history.push("/topic/" + topicId + "/exercise/" + exerciseId)
            }, 200)
        },
        [history, topicId],
    )

    return (
        <>
            <AnimatedDiv transSwitch={transSwitch}>
                <div>
                    <Title text={props.topic.topic_title} />
                    <div className={classes.divWrapper}>
                        {exercises.map((exercise) => {
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
                                        exerciseState={mapStateToEnum(
                                            exercise.is_correct,
                                        )}
                                        marked={
                                            favouriteExercises?.some(
                                                (e) =>
                                                    e.topic_short === topicId &&
                                                    e.enumber ===
                                                        exercise.enumber,
                                            ) || false
                                        }
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </AnimatedDiv>
        </>
    )
}

export default Results
