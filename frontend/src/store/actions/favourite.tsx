// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Favourite } from "../../api"
import { ApiError } from "../../utils/ApiUtils"

export const SET_FAVOURITE_ERROR = "SET_FAVOURITE_ERROR"

export const SET_FAVOURITES = "SET_FAVOURITES"

export type FavouritePayload = Favourite[]
export type FavouriteErrorPayload = ApiError
