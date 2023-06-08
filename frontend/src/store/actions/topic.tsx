// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Topic, TopicOverview } from "../../api"
import { ApiError } from "../../utils/ApiUtils"

export const SET_TOPIC_ERROR = "SET_TOPIC_ERROR"
export const SET_TOPIC = "SET_TOPIC"
export const SET_TOPICS = "SET_TOPICS"
export const SET_TOPIC_OVERVIEWS = "SET_TOPIC_OVERVIEWS"

export type TopicPayload = Topic
export type TopicsPayload = Topic[]
export type TopicOverviewsPayload = TopicOverview[]
export type TopicErrorPayload = ApiError
