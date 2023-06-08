// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { AxiosResponse } from "axios"
import { Configuration } from "../api"
import { BaseAPI } from "../api/base"

interface FailedApiResponse {
    error: ApiError
    data: undefined
}

interface SuccessfulApiResponse<T> {
    data: T
    error: undefined
}

export interface ApiError {
    message: string
    code: number
}

export type ApiResponse<T> = SuccessfulApiResponse<T> | FailedApiResponse

/**
 * hasFailed function checks if an API response has failed.
 *
 * @param {ApiResponse} response - The API response.
 * @returns {response is FailedApiResponse} Whether the response has failed.
 */
export function hasFailed<T>(
    response: ApiResponse<T>,
): response is FailedApiResponse {
    return response.error !== undefined
}

/**
 * apiExec function executes an API request.
 *
 * @param {new (config: Configuration) => API} API - The API class.
 * @param {(api: <API extends BaseAPI>) => Promise<AxiosResponse<T>>} execute - The API request to execute.
 * @returns {Promise<ApiResponse>} The API response.
 */
export const apiExec = async <API extends BaseAPI, T>(
    API: new (config: Configuration) => API,
    execute: (api: API) => Promise<AxiosResponse<T>>,
): Promise<ApiResponse<T>> => {
    try {
        const config = new Configuration()
        const response = await execute(new API(config))

        if (Math.floor(response.status / 100) === 2) {
            return {
                data: response.data,
                error: undefined,
            }
        } else {
            return {
                error: {
                    message: response.statusText,
                    code: response.status,
                },
                data: undefined,
            }
        }
    } catch (error: any) {
        return {
            error: {
                message: error.response?.data || error?.message || "",
                code: error.response?.status,
            },
            data: undefined,
        }
    }
}
