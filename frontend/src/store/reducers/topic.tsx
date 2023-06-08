// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { DefaultApi, Topic, TopicOverview } from "../../api"
import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { RootDispatch } from "./Store"
import { ApiError, apiExec, hasFailed } from "../../utils/ApiUtils"
import {
    SET_TOPIC,
    SET_TOPIC_ERROR,
    SET_TOPIC_OVERVIEWS,
    SET_TOPICS,
    TopicErrorPayload,
    TopicOverviewsPayload,
    TopicPayload,
    TopicsPayload,
} from "../actions/topic"

interface State {
    selectedTopic?: Topic
    topics: Topic[]
    topicOverviews: TopicOverview[]
    error?: ApiError
}

const reduceSetError = (
    draft: Draft<State>,
    action: PayloadAction<TopicErrorPayload>,
) => {
    draft.error = action.payload
}

const reduceSetTopic = (
    draft: Draft<State>,
    action: PayloadAction<TopicPayload>,
) => {
    draft.selectedTopic = action.payload
}

const reduceSetTopics = (
    draft: Draft<State>,
    action: PayloadAction<TopicsPayload>,
) => {
    draft.topics = action.payload
}

const reduceSetTopicOverviews = (
    draft: Draft<State>,
    action: PayloadAction<TopicOverviewsPayload>,
) => {
    draft.topicOverviews = action.payload
}

const slice = createSlice({
    name: "Topic",
    initialState: {
        topics: [],
        topicOverviews: [],
    } as State,
    reducers: {
        [SET_TOPIC]: reduceSetTopic,
        [SET_TOPICS]: reduceSetTopics,
        [SET_TOPIC_OVERVIEWS]: reduceSetTopicOverviews,
        [SET_TOPIC_ERROR]: reduceSetError,
    },
})

const setSelectedTopic = slice.actions[SET_TOPIC]
const setTopics = slice.actions[SET_TOPICS]
const setTopicOverviews = slice.actions[SET_TOPIC_OVERVIEWS]
const setError = slice.actions[SET_TOPIC_ERROR]

const fetchTopics = () => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiListTopic(),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(setTopics(response.data))
    }
}

const fetchTopic = (topicId: string) => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetTopic(topicId),
        )
        if (hasFailed(response)) {
            dispatch(setError(response.error))
            throw new Error(response.error.message)
        }
        dispatch(setSelectedTopic(response.data))
    }
}

const fetchTopicOverviews = () => {
    return async (dispatch: RootDispatch): Promise<void> => {
        const response = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetTopicsOverview(),
        )
        if (hasFailed(response)) {
            throw new Error(response.error.message)
        }
        dispatch(setTopicOverviews(response.data))
    }
}

export { slice as TopicSlice, fetchTopics, fetchTopic, fetchTopicOverviews }
