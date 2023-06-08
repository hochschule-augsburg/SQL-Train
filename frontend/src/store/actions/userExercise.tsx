// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { UserExercise } from "../../api"
import { ApiError } from "../../utils/ApiUtils"
import { ExerciseStateType } from "../reducers/userExercise"

export const SET_USER_EXERCISES_ERROR = "SET_USER_EXERCISES_ERROR"
export const SET_USER_EXERCISES = "SET_USER_EXERCISES"
export const SET_USER_EXERCISE = "SET_USER_EXERCISE"
export const UPDATE_EXERCISE_STATE = "UPDATE_EXERCISE_STATE"

export type UserExercisesPayload = UserExercise[]
export type UserExercisePayload = UserExercise
export type UserExerciseErrorPayload = ApiError
export type UserExerciseStatePayload = ExerciseStateType
