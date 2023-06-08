// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { DefaultApi, Stats as StatsInterface } from "../../api"
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { RootDispatch } from "./Store"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { SET_RESULTS, ResultsPayload } from "../actions/profSearch"
import { FOTypes } from "../reducers/filter"
import { FilterOption } from "./filter"

interface State {
    results: StatsInterface | undefined
}

const reduceSetResults = (
    draft: Draft<State>,
    action: PayloadAction<ResultsPayload>,
) => {
    draft.results = action.payload
}

const slice = createSlice({
    name: "ProfSearch",
    initialState: {
        results: undefined,
    } as State,
    reducers: {
        [SET_RESULTS]: reduceSetResults,
    },
})

const setResults = slice.actions[SET_RESULTS]

const fetchProfResults = (opts: FilterOption[]) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) => {
            return api.exercisesStatsApiExercises(
                opts
                    .filter((e) => e.type === FOTypes.Topic)
                    .map((e) => e.short ?? ""),
                opts
                    .filter((e) => e.type === FOTypes.TTitle)
                    .map((e) => e.name),
                undefined,
                opts
                    .filter((e) => e.type === FOTypes.ETitle)
                    .map((e) => e.name),
                opts.filter((e) => e.type === FOTypes.ETag).map((e) => e.name),
                opts.filter((e) => e.type === FOTypes.TTag).map((e) => e.name),
                opts
                    .filter((e) => e.type === FOTypes.EDiff)
                    .map((e) => parseInt(e.name)),
            )
        })
        if (hasFailed(response)) {
            // TODO
        } else {
            dispatch(setResults(response.data))
        }
    }
}

export { slice as ProfSearchSlice, fetchProfResults }
