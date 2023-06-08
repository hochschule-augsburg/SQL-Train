// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import {
    ExercisePayload,
    ExercisesPayload,
    ExerciseErrorPayload,
    SELECT_EXERCISE,
    SET_EXERCISES,
    SET_EXERCISE_ERROR,
} from "../actions/exercise"
import { RootDispatch } from "./Store"
import { ApiError, apiExec, hasFailed } from "../../utils/ApiUtils"
import { DefaultApi, Exercise, ExerciseItem } from "../../api"

interface State {
    exercises: ExerciseItem[]
    selectedExercise?: Exercise
    error?: ApiError
}

const reduceSetError = (
    draft: Draft<State>,
    action: PayloadAction<ExerciseErrorPayload>,
) => {
    draft.error = action.payload
}

const reduceSelectExercise = (
    draft: Draft<State>,
    action: PayloadAction<ExercisePayload>,
) => {
    draft.selectedExercise = action.payload
}

const reduceSetExercises = (
    draft: Draft<State>,
    action: PayloadAction<ExercisesPayload>,
) => {
    draft.exercises = action.payload
}

const slice = createSlice({
    name: "Exercise",
    initialState: {
        exercises: [],
    } as State,
    reducers: {
        [SET_EXERCISE_ERROR]: reduceSetError,
        [SELECT_EXERCISE]: reduceSelectExercise,
        [SET_EXERCISES]: reduceSetExercises,
    },
})

const setError = slice.actions[SET_EXERCISE_ERROR]
const selectExercise = slice.actions[SELECT_EXERCISE]
const setExercises = slice.actions[SET_EXERCISES]

const fetchExercises = (topicId: string) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListExercise(topicId),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(setExercises(response.data))
    }
}

const fetchExercise = (topicId: string, exerciseId: number) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetExercise(topicId, exerciseId),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(selectExercise(response.data))
    }
}

export { slice as ExerciseSlice, fetchExercise, fetchExercises }
