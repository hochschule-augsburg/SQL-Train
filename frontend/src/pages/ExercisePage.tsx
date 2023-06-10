// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"
import { useParams } from "react-router"
import HorizontalScrollingMenu from "../components/scrollMenu/HorizontalScrollingMenu"
import QuestionBox from "../components/exercise/QuestionBox"
import { useTranslation } from "react-i18next"
import { DefaultApi, Result } from "../api"
import "./../components/customBar.css"
import "allotment/dist/style.css"
import { ApiError, apiExec, hasFailed } from "../utils/ApiUtils"
import { DarkModeContext } from "../components/layout/DarkModeContext"
import { Toast } from "../components/info/Toast"
import CustomAllotment from "../components/exercise/allotment/CustomAllotment"
import If from "../components/conditional/If"
import { makeStyles } from "tss-react/mui"
import AnimatedDiv from "../components/animation/AnimatedDiv"
import { RootState, useAppDispatch } from "../store/reducers/Store"
import {
    ExerciseEnum,
    fetchUserExercise,
    fetchUserExercises,
    updateExerciseState,
} from "../store/reducers/userExercise"
import { fetchTopic } from "../store/reducers/topic"
import { useSelector } from "react-redux"
import { fetchExercise } from "../store/reducers/exercise"
import { getSolutionContent } from "../utils/ExerciseUtils"
import { fetchFavourites } from "../store/reducers/favourite"
import ConfettiExplosion from "react-confetti-explosion"
import { ErrorContext } from "../components/layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    dataModel: {
        display: "block",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "20px",
        height: "auto",
        border: "solid 1px black",
        justifySelf: "center",
    },
    confettiWrapper: {
        display: "flex",
        justifyContent: "space-between",
        width: "50%",
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
    },
}))

type ExercisePageParams = {
    topicId: string
    exerciseId: string
}

export enum AllotmentState {
    NEW = "new",
    SOLUTION = "solution",
    EXECUTE = "execute",
    CHECK = "check",
    RESET = "reset",
}

/**
 * ExercisePage component represents the exercise page.
 *
 * @component
 * @returns {JSX.Element} ExercisePage component.
 */
const ExercisePage: React.FC = () => {
    const { t } = useTranslation("common")
    const { classes } = useStyles()

    const { darkMode } = useContext(DarkModeContext)
    const { setError } = useContext(ErrorContext)

    const dispatch = useAppDispatch()

    const ref = useRef<HTMLImageElement | null>(null)
    const { topicId, exerciseId } = useParams<ExercisePageParams>()

    const selectedTopic = useSelector(
        (state: RootState) => state.topic.selectedTopic,
    )
    const userExercise = useSelector((state: RootState) => state.userExercises)
    const exercise = useSelector(
        (state: RootState) => state.exercises.selectedExercise,
    )
    const exercises = useSelector(
        (state: RootState) => state.exercises.exercises,
    )
    const favourites = useSelector(
        (state: RootState) => state.favourite.favourites,
    )

    const [isExploding, setIsExploding] = useState<boolean>(false)
    const [inputQuery, setInputQuery] = useState<string>("")
    const [tableCont, setTableCont] = useState<Result>()
    const [allotmentState, setAllotmentState] = useState<
        AllotmentState | undefined
    >(undefined)
    const [solutionTableCont, setSolutionTableCont] = useState<Result>()
    const [disableToolbarButtons, setDisableToolbarButtons] =
        useState<boolean>(false)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [isFeedbackPos, setIsFeedbackPos] = useState<boolean | undefined>(
        undefined,
    )
    const [showDataModel, setShowDataModel] = useState<boolean>(false)
    const [marked, setMarked] = useState<boolean>(false)
    const [natural, setNatural] = useState<boolean>(false)

    /**
     *  setUserDBError function sets the errors of the pg_stud api in the ErrorContext
     *
     * @param {ApiError} response - The error that was send from backend
     * @returns {void} The function does not return a value.
     */
    const setUserDBError = useCallback(
        (response: ApiError) => {
            setError(t("general.error.user_db", { message: response.message }))
        },
        [setError, t],
    )

    /**
     *  handleAllotmentStates function handles the state transition for allotment based on the specified allotment state.
     *
     * @param {AllotmentState} allotmentStateTo - The allotment state to transition to.
     * @returns {void} The function does not return a value.
     */
    const handleAllotmentStates = useCallback(
        (allotmentStateTo: AllotmentState) => {
            switch (allotmentStateTo) {
                case AllotmentState.NEW:
                    setTableCont(undefined)
                    setAllotmentState(allotmentStateTo)
                    break
                case AllotmentState.EXECUTE:
                case AllotmentState.RESET:
                    setAllotmentState(allotmentStateTo)
                    break
                case AllotmentState.CHECK:
                case AllotmentState.SOLUTION:
                    setAllotmentState(allotmentStateTo)
                    break
                default:
                    break
            }
        },
        [],
    )

    useEffect(() => {
        dispatch(fetchExercise(topicId, parseInt(exerciseId))).catch(() =>
            setError(t("general.error.exercise")),
        )
        dispatch(fetchUserExercise(topicId, parseInt(exerciseId))).catch(() =>
            setError(t("general.error.user_exercise")),
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
        handleAllotmentStates(AllotmentState.NEW)
    }, [
        handleAllotmentStates,
        dispatch,
        topicId,
        exerciseId,
        marked,
        t,
        setError,
    ])

    useEffect(() => {
        setDisableToolbarButtons(false)
        if (userExercise.selectedUserExercise?.buffer_save === undefined) {
            setInputQuery("")
        } else {
            setInputQuery(userExercise.selectedUserExercise.buffer_save)
        }
    }, [userExercise.selectedUserExercise])

    useEffect(() => {
        const favouriteExercises = favourites.find(
            (e) =>
                e.topic_short === topicId && e.enumber === parseInt(exerciseId),
        )
        setMarked(favouriteExercises !== undefined)
    }, [exerciseId, favourites, topicId])

    /**
     * commentString function adds comments to each line of text.
     *
     * @param {string} text - The text to comment.
     * @returns {string} The commented text.
     */
    const commentString = useCallback((text: string): string => {
        const lines = text.split("\n")
        const commentedLines = lines.map((line) => `-- ${line}`)
        return commentedLines.join("\n")
    }, [])

    /**
     * executeDataModelHandler function toggles the display of the data model.
     *
     * @returns {void} The function does not return a value.
     */
    const executeDataModelHandler = useCallback(() => {
        setShowDataModel((prev) => !prev)
    }, [])

    /**
     * patchUserExercise function updates the user exercise in the database.
     *
     * @returns {void} The function does not return a value.
     */
    const patchUserExercise = useCallback(async () => {
        if (disableToolbarButtons || inputQuery.trim().length < 3) {
            return
        }
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiPatchUserExercise(topicId, parseInt(exerciseId), {
                buffer_save: inputQuery,
            }),
        )
        if (hasFailed(response)) {
            return setError(t("general.error.exercise"))
        }
    }, [disableToolbarButtons, inputQuery, topicId, exerciseId, setError, t])

    /**
     * handleListSolution function retrieves and displays the solution for the exercise.
     *
     * @returns {void} The function does not return a value.
     */
    const handleListSolution = useCallback(async () => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListSolution(topicId, parseInt(exerciseId)),
        )
        if (hasFailed(response)) {
            return setUserDBError(response.error)
        }
        const results = getSolutionContent(response.data)
        setInputQuery(
            commentString(inputQuery) +
                `\n-- ${t("exercise.solution", {
                    count: response.data.length,
                })}\n` +
                results,
        )
    }, [commentString, exerciseId, inputQuery, setUserDBError, t, topicId])

    /**
     * solutionClickHandler function handles the logic when the solution button is clicked.
     *
     * @returns {void} The function does not return a value.
     */
    const solutionClickHandler = useCallback(async () => {
        if (inputQuery.trim().length < 3) {
            return setError(t("general.error.noQuery"))
        }
        setDisableToolbarButtons(true)
        await handleListSolution()
        const responseUserRes = await apiExec(DefaultApi, (api) =>
            api.pgStudApiExecuteQuery({
                topic_short: topicId,
                enumber: parseInt(exerciseId),
                query: inputQuery,
            }),
        )
        const responseSolRes = await apiExec(DefaultApi, (api) =>
            api.pgStudApiSolutionResult({
                topic_short: topicId,
                enumber: parseInt(exerciseId),
            }),
        )
        if (hasFailed(responseUserRes)) {
            return setUserDBError(responseUserRes.error)
        }
        if (hasFailed(responseSolRes)) {
            return setUserDBError(responseSolRes.error)
        }
        setTableCont(responseUserRes.data.result)
        setSolutionTableCont(responseSolRes.data.result)
        handleAllotmentStates(AllotmentState.SOLUTION)
    }, [
        exerciseId,
        handleAllotmentStates,
        handleListSolution,
        inputQuery,
        setError,
        setUserDBError,
        t,
        topicId,
    ])

    /**
     * isTopicComplete return true is all exercises from the selected topic are
     * correct otherwise false.
     *
     * @param {boolean} correct - Was the exercise correct?
     * @returns {boolean} - Are all exercises from topic correct
     */
    const isTopicComplete = useCallback(
        (correct: boolean) => {
            if (
                !correct ||
                exercises.length !== userExercise.userExercises.length
            ) {
                return false
            }
            return userExercise.userExerciseState.every((e) => {
                if (e.id === exercise?.id) {
                    return true
                }
                return e.state === ExerciseEnum.CORRECT
            })
        },
        [
            exercise?.id,
            exercises,
            userExercise.userExerciseState,
            userExercise.userExercises,
        ],
    )

    /**
     * getFeedbackMessage returns a feedback message based on correct.
     * By a chance of 1:20 a funny message is used instead of a neutral.
     *
     * @param {boolean} correct - Was the exercise correct?
     * @returns {string} - Positive feedback message.
     */
    const getFeedbackMessage = useCallback(
        (correct: boolean) => {
            const type = correct ? "positive" : "negative"
            const randomNumber = Math.floor(Math.random() * 10)
            if (randomNumber === 0) {
                const randomMessageNumber = Math.floor(Math.random() * 20)
                return t(`general.feedback.${type}.${randomMessageNumber}`)
            } else {
                return t(`general.feedback.${type}.neutral`)
            }
        },
        [t],
    )

    /**
     * showCorrectToast is a callback function that displays a toast notification with feedback based on whether the answer is correct or not.
     *
     * @param {boolean} correct - Flag indicating whether the answer is correct.
     * @param {string} [message] - Optional message to be included in the feedback.
     * @returns {void}
     */
    const showCorrectToast = useCallback(
        (correct: boolean, message?: string) => {
            setIsFeedbackPos(correct)
            const feedback = getFeedbackMessage(correct)
            " " + message ?? ""
            setFeedback(feedback)
        },
        [getFeedbackMessage],
    )

    /**
     * checkAnswerClickHandler function handles the logic when the check answer button is clicked.
     *
     * @returns {void} The function does not return a value.
     */
    const checkAnswerClickHandler = useCallback(async () => {
        if (inputQuery.trim().length < 3) {
            return setError(t("general.error.noQuery"))
        }
        if (inputQuery.toLowerCase().includes("natural join")) {
            setNatural(true)
        }
        const response = await apiExec(DefaultApi, (api) =>
            api.pgStudApiCheckAnswerCorrectApi({
                topic_short: topicId,
                enumber: parseInt(exerciseId),
                query: inputQuery,
            }),
        )
        if (hasFailed(response)) {
            return setUserDBError(response.error)
        }
        if (!exercise?.id) {
            return setError(t("general.error.unknown"))
        }
        dispatch(
            updateExerciseState({
                id: exercise.id,
                state: response.data.correct
                    ? ExerciseEnum.CORRECT
                    : ExerciseEnum.WRONG,
            }),
        )
        if (isTopicComplete(response.data.correct)) {
            setIsExploding(true)
        }
        showCorrectToast(response.data.correct, response.data.message)
        setTableCont(response.data.user_result)
        setSolutionTableCont(response.data.solu_result)
        handleAllotmentStates(AllotmentState.CHECK)
    }, [
        inputQuery,
        topicId,
        exerciseId,
        setError,
        setUserDBError,
        isTopicComplete,
        t,
        exercise,
        dispatch,
        showCorrectToast,
        handleAllotmentStates,
    ])

    /**
     *  executeQueryClickHandler function handles the logic when the execute query button is clicked.
     *
     * @returns {void} The function does not return a value.
     */
    const executeQueryClickHandler = useCallback(async () => {
        if (inputQuery.trim().length < 3) {
            return setError(t("general.error.noQuery"))
        }
        const response = await apiExec(DefaultApi, (api) =>
            api.pgStudApiExecuteQuery({
                topic_short: topicId,
                enumber: parseInt(exerciseId),
                query: inputQuery,
            }),
        )
        if (hasFailed(response)) {
            return setUserDBError(response.error)
        }
        setTableCont(response.data.result)
        handleAllotmentStates(AllotmentState.EXECUTE)
    }, [
        inputQuery,
        handleAllotmentStates,
        setError,
        t,
        topicId,
        exerciseId,
        setUserDBError,
    ])

    /**
     * handleResetDataBase function resets the exercise database and updates the user exercise in the database.
     *
     * @returns {void} The function does not return a value.
     */
    const handleResetDataBase = useCallback(async () => {
        await patchUserExercise()
        const response = await apiExec(DefaultApi, (api) =>
            api.pgStudApiResetDb({
                topic_short: topicId,
                enumber: parseInt(exerciseId),
            }),
        )
        if (hasFailed(response)) {
            return setUserDBError(response.error)
        }
        setTableCont({ result: [response.data] })
        handleAllotmentStates(AllotmentState.RESET)
    }, [
        patchUserExercise,
        handleAllotmentStates,
        topicId,
        exerciseId,
        setUserDBError,
    ])

    /**
     * toggleFavourite function toggles the favorite status of the exercise.
     *
     * @returns {void} The function does not return a value.
     */
    const toggleFavourite = useCallback(async () => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiPatchUserExercise(topicId, parseInt(exerciseId), {
                favourite: !marked,
            }),
        )
        if (hasFailed(response)) {
            return setError(t("general.error.exercise"))
        }
        setMarked(!marked)
    }, [topicId, setError, exerciseId, marked, t])

    useEffect(() => {
        if (showDataModel) {
            setTimeout(() => {
                ref.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        }
    }, [showDataModel])

    if (!topicId || !exerciseId) {
        return <></>
    }

    return (
        <>
            {/* <ExerciseTour /> */}
            <If condition={isExploding}>
                <div className={classes.confettiWrapper}>
                    <ConfettiExplosion
                        force={0.4}
                        duration={1500}
                        particleCount={30}
                        onComplete={() => setIsExploding(false)}
                    />
                    <ConfettiExplosion
                        force={0.4}
                        duration={1500}
                        particleCount={30}
                        onComplete={() => setIsExploding(false)}
                    />
                </div>
            </If>
            <Toast
                message={feedback}
                onClose={() => setFeedback(null)}
                positive={isFeedbackPos}
            />
            <HorizontalScrollingMenu
                exerciseStates={userExercise.userExerciseState}
                setBuffer={patchUserExercise}
                current={exercise?.enumber as number}
                natural={natural}
            />

            <AnimatedDiv transSwitch={true}>
                <QuestionBox
                    topic={selectedTopic}
                    exercise={exercise}
                    toggleFavourite={toggleFavourite}
                    marked={marked}
                />

                <CustomAllotment
                    executeDataModelHandler={executeDataModelHandler}
                    executeQueryClickHandler={executeQueryClickHandler}
                    solutionClickHandler={solutionClickHandler}
                    checkAnswerClickHandler={checkAnswerClickHandler}
                    handleResetDataBase={handleResetDataBase}
                    inputQuery={inputQuery}
                    setInputQuery={setInputQuery}
                    tableCont={tableCont}
                    solutionTableCont={solutionTableCont}
                    disableToolbarButtons={disableToolbarButtons}
                    allotmentState={allotmentState}
                />

                <If condition={showDataModel}>
                    <img
                        id="dataModel"
                        ref={ref}
                        className={classes.dataModel}
                        style={{ filter: darkMode ? "invert(100%)" : "none" }}
                        alt="dataModel"
                        src={`/media${selectedTopic?.datamodel_representation}`}
                    />
                </If>
            </AnimatedDiv>
        </>
    )
}

export default ExercisePage
