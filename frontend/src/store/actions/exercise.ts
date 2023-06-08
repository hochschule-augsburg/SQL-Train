// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Exercise, ExerciseItem } from "../../api"
import { ApiError } from "../../utils/ApiUtils"

export const SET_EXERCISE_ERROR = "SET_TOPIC_ERROR"
export const SELECT_TOPIC = "SELECT_TOPIC"
export const SELECT_EXERCISE = "SELECT_EXERCISE"
export const SET_EXERCISES = "SET_EXERCISES"
export const SET_EXERCISE = "SET_EXERCISE"

export type ExercisePayload = Exercise
export type ExercisesPayload = ExerciseItem[]
export type ExerciseErrorPayload = ApiError
