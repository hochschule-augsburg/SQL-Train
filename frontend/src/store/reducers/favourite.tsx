// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { DefaultApi, Favourite } from "../../api"
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { RootDispatch } from "./Store"
import { ApiError, apiExec, hasFailed } from "../../utils/ApiUtils"
import {
    FavouriteErrorPayload,
    FavouritePayload,
    SET_FAVOURITE_ERROR,
    SET_FAVOURITES,
} from "../actions/favourite"

interface State {
    favourites: Favourite[]
    error?: ApiError
}

const reduceSetError = (
    draft: Draft<State>,
    action: PayloadAction<FavouriteErrorPayload>,
) => {
    draft.error = action.payload
}

const reduceSetFavourites = (
    draft: Draft<State>,
    action: PayloadAction<FavouritePayload>,
) => {
    draft.favourites = action.payload
}

const slice = createSlice({
    name: "Favourite",
    initialState: {
        favourites: [],
    } as State,
    reducers: {
        [SET_FAVOURITE_ERROR]: reduceSetError,
        [SET_FAVOURITES]: reduceSetFavourites,
    },
})

const setError = slice.actions[SET_FAVOURITE_ERROR]
const setFavourites = slice.actions[SET_FAVOURITES]

const fetchFavourites = () => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListFavourite(),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(setFavourites(response.data))
    }
}

export { slice as FavouriteSlice, fetchFavourites }
