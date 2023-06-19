// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import config from "../../config.json"
import { makeStyles } from "tss-react/mui"
import { Exercise, Topic } from "../../api"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles()(() => ({
    questionBox: {
        backgroundColor: config.THEME_COLORS.SECONDARY,
        color: config.THEME_COLORS.NEUTRAL,
        minHeight: "100px",
        height: "auto",
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: "1%",
        borderRadius: "5px",
        padding: "5px",
        position: "relative",
    },
    points: {
        float: "right",
    },
    star: {
        position: "absolute",
        bottom: "4px",
        right: "9px",
        cursor: "pointer",
    },
    marked: {
        color: config.THEME_COLORS.PRIMARY,
    },
}))

interface Props {
    exercise?: Exercise
    topic?: Topic
    toggleFavourite: () => void
    marked: boolean
}

/**
 * QuestionBox component displays a box containing exercise information and question.
 *
 * @param {Props} props - Component properties.
 * @param {string} props.exerciseInfo - Information about the exercise.
 * @param {string | undefined} props.question - Exercise question.
 * @param {function} props.toggleFavourite - Callback function for toggling the favorite status.
 * @param {boolean} props.marked - Flag indicating whether the exercise is marked as favorite.
 * @returns {JSX.Element} QuestionBox component.
 */
const QuestionBox: React.FC<Props> = (props) => {
    const { classes, cx } = useStyles()
    const { t } = useTranslation("common")

    const { exercise, topic, toggleFavourite, marked } = props

    return (
        <div className={classes.questionBox}>
            <span>
                {`${topic?.title}/${exercise?.enumber}: ${exercise?.title}`}
            </span>
            <span className={classes.points}>
                {t("exercise.points", { count: exercise?.points })}
            </span>
            <span>
                <br></br>
                {exercise?.question}
            </span>

            <i
                className={cx(
                    "bi bi-star-fill",
                    classes.star,
                    marked ? classes.marked : "",
                )}
                onClick={toggleFavourite}
            />
        </div>
    )
}

export default QuestionBox
