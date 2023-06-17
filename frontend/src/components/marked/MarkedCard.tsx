// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback } from "react"
import config from "../../../../config.json"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router"
import { Favourite } from "../../api"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    card: {
        marginBottom: "8px",
        padding: "5px",
        margin: "0px 5px",
        height: "8%",
        display: "flex",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "5px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        backgroundColor: config.THEME_COLORS.SECONDARY,
        color: config.THEME_COLORS.NEUTRAL,
        textAlign: "center",
        position: "relative",
        cursor: "pointer",
    },
    exerciseBadge: {
        margin: "4px",
        width: "30px",
        height: "30px",
        borderStyle: "solid",
        borderWidth: "2px",
        borderRadius: "20px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        color: config.THEME_COLORS.NEUTRAL,
        backgroundColor: config.THEME_COLORS.SECONDARY,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    difficultyBadge: {
        margin: "4px",
        width: "50px",
        height: "20px",
        borderStyle: "solid",
        borderRadius: "4px",
        borderWidth: "2px",
        fontWeight: "bold",
        fontSize: "11px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        color: config.THEME_COLORS.NEUTRAL,
        backgroundColor: config.THEME_COLORS.SECONDARY,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    star: {
        position: "absolute",
        right: "7px",
        cursor: "pointer",
        fontSize: "22px",
        color: config.THEME_COLORS.PRIMARY,
        "&:hover": {
            color: "white",
        },
    },
}))

interface Props {
    favouriteExercise: Favourite
    closeCard: () => void
    handleUnmark: (topicId: string, exerciseId: number) => void
}

/**
 * MarkedCard component displays an individual marked exercise card.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {Favourite} props.favouriteExercise - The marked exercise object.
 * @param {Function} props.closeCard - Function to close the marked card.
 * @param {Function} props.handleUnmark - Function to handle to unmark the exercise.
 * @returns {JSX.Element} MarkedCard component.
 */
const MarkedCard: React.FC<Props> = (props) => {
    const { classes, cx } = useStyles()
    const { t } = useTranslation("common")

    const history = useHistory()

    const { favouriteExercise, closeCard, handleUnmark } = props

    /**
     * handleSelect function handles the selection of a favourite exercise. It closes the card and navigates to the exercise page.
     *
     * @returns {void} The function does not return a value.
     */
    const handleSelect = useCallback(() => {
        closeCard()
        history.push(
            `/topic/${favouriteExercise.topic_short}/exercise/${favouriteExercise.enumber}`,
        )
    }, [
        closeCard,
        favouriteExercise.enumber,
        favouriteExercise.topic_short,
        history,
    ])

    return (
        <div className={classes.card} onClick={handleSelect}>
            <div>{favouriteExercise.topic_title}</div>
            <div className={classes.exerciseBadge}>
                {favouriteExercise.enumber}
            </div>
            <div className={classes.difficultyBadge}>
                {t(`difficulty.${favouriteExercise.difficulty}`)}
            </div>

            <i
                className={cx("bi bi-star-fill", classes.star)}
                onClick={(e) => {
                    e.stopPropagation()
                    handleUnmark(
                        favouriteExercise.topic_short,
                        favouriteExercise.enumber,
                    )
                }}
            />
        </div>
    )
}

export default MarkedCard
