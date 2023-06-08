// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { DefaultApi, UserExercise } from "../../api"
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import {
    SET_USER_EXERCISE,
    SET_USER_EXERCISES,
    SET_USER_EXERCISES_ERROR,
    UPDATE_EXERCISE_STATE,
    UserExerciseErrorPayload,
    UserExercisePayload,
    UserExercisesPayload,
    UserExerciseStatePayload,
} from "../actions/userExercise"
import { RootDispatch } from "./Store"
import { ApiError, apiExec, hasFailed } from "../../utils/ApiUtils"

export enum ExerciseEnum {
    DEFAULT,
    CORRECT,
    WRONG,
}
export interface ExerciseStateType {
    id: number
    state: ExerciseEnum
}

interface State {
    selectedUserExercise?: UserExercise
    userExercises: UserExercise[]
    userExerciseState: ExerciseStateType[]
    error?: ApiError
}

const reduceSetError = (
    draft: Draft<State>,
    action: PayloadAction<UserExerciseErrorPayload>,
) => {
    draft.error = action.payload
}

const mapStateToEnum = (is_correct?: boolean) => {
    switch (is_correct) {
        case true:
            return ExerciseEnum.CORRECT
        case false:
            return ExerciseEnum.WRONG
        default:
            return ExerciseEnum.DEFAULT
    }
}

const reduceSetUserExercises = (
    draft: Draft<State>,
    action: PayloadAction<UserExercisesPayload>,
) => {
    draft.userExercises = action.payload
    action.payload.forEach((exercise) => {
        draft.userExerciseState.push({
            id: exercise.exercise,
            state: mapStateToEnum(exercise.is_correct),
        })
    })
}
const reduceSetUserExercise = (
    draft: Draft<State>,
    action: PayloadAction<UserExercisePayload>,
) => {
    draft.selectedUserExercise = action.payload
}

const reduceExerciseState = (
    draft: Draft<State>,
    action: PayloadAction<UserExerciseStatePayload>,
) => {
    const updatedStates = draft.userExerciseState.filter(
        (e) => e.id !== action.payload.id,
    )
    updatedStates.push(action.payload)
    draft.userExerciseState = updatedStates
}

const slice = createSlice({
    name: "UserExercises",
    initialState: {
        userExercises: [],
        userExerciseState: [],
    } as State,
    reducers: {
        [SET_USER_EXERCISES]: reduceSetUserExercises,
        [SET_USER_EXERCISE]: reduceSetUserExercise,
        [SET_USER_EXERCISES_ERROR]: reduceSetError,
        [UPDATE_EXERCISE_STATE]: reduceExerciseState,
    },
})

const setUserExercises = slice.actions[SET_USER_EXERCISES]
const setUserExercise = slice.actions[SET_USER_EXERCISE]
const setError = slice.actions[SET_USER_EXERCISES_ERROR]
const updateExerciseState = slice.actions[UPDATE_EXERCISE_STATE]

const fetchUserExercises = (topicId: string) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListUserExercise(topicId),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(setUserExercises(response.data))
    }
}

const fetchUserExercise = (topicId: string, exerciseId: number) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetUserExercise(topicId, exerciseId),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error()
        }
        dispatch(setUserExercise(response.data))
    }
}

export {
    slice as UserExercisesSlice,
    fetchUserExercises,
    fetchUserExercise,
    mapStateToEnum,
    updateExerciseState,
}
