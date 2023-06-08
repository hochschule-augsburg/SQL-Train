// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { RootDispatch } from "./Store"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { DefaultApi } from "../../api"
import { FilterOptsPayload, SET_OPTS, SELECT_OPT } from "../actions/filter"

export enum FOTypes {
    ETitle,
    TTitle,
    TTag,
    ETag,
    EDiff,
    Topic,
}
export interface FilterOption {
    name: string
    type: FOTypes
    short?: string
}

interface State {
    opts: FilterOption[]
    selOpts: FilterOption[]
}

const reduceSetOpts = (
    draft: Draft<State>,
    action: PayloadAction<FilterOptsPayload>,
) => {
    draft.opts = action.payload
}

const reduceSelOpts = (
    draft: Draft<State>,
    action: PayloadAction<FilterOptsPayload>,
) => {
    draft.selOpts = action.payload
}

const slice = createSlice({
    name: "ProfFilter",
    initialState: {
        opts: [],
        selOpts: [],
    } as State,
    reducers: {
        [SELECT_OPT]: reduceSelOpts,
        [SET_OPTS]: reduceSetOpts,
    },
})

const selectOpt = slice.actions[SELECT_OPT]
const setOpts = slice.actions[SET_OPTS]

const fetchFilterOpts = () => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const responseETag = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListEtag(),
        )
        const responseTTag = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListTtag(),
        )
        const responseTopics = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListTopic(),
        )
        if (
            hasFailed(responseETag) ||
            hasFailed(responseTTag) ||
            hasFailed(responseTopics)
        ) {
            // TODO
        } else {
            const opts: FilterOption[] = []
            responseETag.data.map((e) => {
                opts.push({ name: e.name, type: FOTypes.ETag })
            })
            responseTTag.data.map((e) => {
                opts.push({ name: e.name, type: FOTypes.TTag })
            })
            responseTopics.data.map((e) => {
                opts.push({
                    name: e.title,
                    short: e.short,
                    type: FOTypes.Topic,
                })
            })
            // Add exercise difficulties
            opts.push({ name: "1", type: FOTypes.EDiff })
            opts.push({ name: "2", type: FOTypes.EDiff })
            opts.push({ name: "3", type: FOTypes.EDiff })
            dispatch(setOpts(opts as FilterOption[]))
        }
    }
}

export { slice as ProfFilter, selectOpt, fetchFilterOpts }
