// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { SET_USERDATA, userPayload } from "../actions/user"
import { DefaultApi } from "../../api"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { RootDispatch } from "./Store"

interface State {
    userdata: userPayload | undefined
}

const reduceSetUserdata = (
    draft: Draft<State>,
    action: PayloadAction<userPayload>,
) => {
    draft.userdata = action.payload
}

const slice = createSlice({
    name: "User",
    initialState: {
        userdata: undefined,
    } as State,
    reducers: {
        [SET_USERDATA]: reduceSetUserdata,
    },
})

const fetchUserdata = () => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetUserdata(),
        )
        if (hasFailed(response)) {
            throw new Error(response.error.message)
        }
        dispatch(setUserdata(response.data))
    }
}

const setUserdata = slice.actions[SET_USERDATA]

export { slice as UserSlice, setUserdata, fetchUserdata }
