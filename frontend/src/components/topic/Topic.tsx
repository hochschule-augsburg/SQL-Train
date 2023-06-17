// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { UncontrolledTooltip } from "reactstrap"
import config from "../../../../config.json"
import { makeStyles } from "tss-react/mui"
import TopicButton from "./TopicButton"
import { useTranslation } from "react-i18next"
import { LinearProgress } from "@mui/material"

const useStyles = makeStyles()(() => ({
    topic: {
        marginLeft: "10px",
        marginRight: "10px",
        marginBottom: "15px",
        marginTop: "20px",
    },
    progress: {
        backgroundColor: config.THEME_COLORS.PRIMARY,
        marginTop: "5px",
        marginLeft: "15px",
        marginRight: "15px",
        height: "5px",
    },
}))

interface Props {
    topicId: string
    topicTitle: string
    tag?: string
    count: number
    count_correct: number
}

/**
 * Topic component represents a topic in the topic list.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {string} props.topicId - Unique ID for the topic.
 * @param {string} props.topicTitle - Title of the topic.
 * @param {number} props.difficulty - Difficulty level of the topic.
 * @param {number} props.count - Total number of exercises in the topic.
 * @param {number} props.count_correct - Number of correctly solved exercises in the topic.
 * @returns {JSX.Element} Topic component.
 */
const Topic: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const { t } = useTranslation("common")

    const { topicId, topicTitle, tag, count, count_correct } = props

    return (
        <div className={classes.topic}>
            <TopicButton text={topicTitle} tag={tag} id={"Button" + topicId} />
            <LinearProgress
                aria-label="Correct Exercises"
                className={classes.progress}
                id={"Progress" + topicId}
                variant={"determinate"}
                color="success"
                value={(count_correct / count) * 100}
            />
            <UncontrolledTooltip
                placement="top"
                target={"Progress" + topicId}
                delay={{ show: 400, hide: 0 }}
            >
                {t("topic.numberSolved", {
                    number: `${count_correct} / ${count}`,
                })}
            </UncontrolledTooltip>
            <UncontrolledTooltip
                placement="top"
                target={"Button" + topicId}
                delay={{ show: 400, hide: 0 }}
            >
                {t("topic.numberSolved", {
                    number: `${count_correct} / ${count}`,
                })}
            </UncontrolledTooltip>
        </div>
    )
}

export default Topic
