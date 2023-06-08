// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { UserSlice } from "./user"
import { ExerciseSlice } from "./exercise"
import { useDispatch } from "react-redux"
import { UserExercisesSlice } from "./userExercise"
import { TopicSlice } from "./topic"
import { FavouriteSlice } from "./favourite"
import { SearchSlice } from "./search"
import { FilterSlice } from "./filter"
import { ProfSearchSlice } from "./profSearch"
import { ProfFilter } from "./profFilter"

export const rootReducer = combineReducers({
    user: UserSlice.reducer,
    exercises: ExerciseSlice.reducer,
    userExercises: UserExercisesSlice.reducer,
    topic: TopicSlice.reducer,
    favourite: FavouriteSlice.reducer,
    filter: FilterSlice.reducer,
    profFilter: ProfFilter.reducer,
    search: SearchSlice.reducer,
    profSearch: ProfSearchSlice.reducer,
})

export const store = configureStore({
    reducer: <RootState>(state: RootState, action: { type: string }) => {
        return rootReducer(state as any, action)
    },
})

export type RootState = ReturnType<typeof rootReducer>
export type RootDispatch = typeof store.dispatch

export const useAppDispatch: () => RootDispatch = useDispatch
