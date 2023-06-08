// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect, useState, useCallback, useContext } from "react"
import { DarkModeContext } from "../layout/DarkModeContext"
import config from "../../config.json"
import MarkedCard from "./MarkedCard"
import { makeStyles } from "tss-react/mui"
import { Drawer } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../../store/reducers/Store"
import { fetchFavourites } from "../../store/reducers/favourite"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { DefaultApi } from "../../api"
import { ErrorContext } from "../layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    headline: {
        width: "322px",
        lineHeight: "41px",
        textAlign: "center",
        padding: "10px 0px",
        fontSize: "20px",
        backgroundColor: config.THEME_COLORS.PRIMARY,
        color: config.THEME_COLORS.NEUTRAL,
    },
    canvas: {
        paddingInline: "20px",
    },
    button: {
        "& button:focus": {
            boxShadow: "none !important",
        },
    },
}))

interface Props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

/**
 * Marked component displays a list of marked exercises.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {boolean} props.isOpen - Determines if the marked component is open or not.
 * @param {Function} props.setIsOpen - Function to set the open state of the marked component.
 * @returns {JSX.Element} Marked component.
 */
const Marked: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const { t } = useTranslation("common")

    const { isOpen, setIsOpen } = props
    const { darkMode } = useContext(DarkModeContext)
    const { setError } = useContext(ErrorContext)

    const dispatch = useAppDispatch()
    const favouriteExercises = useSelector(
        (state: RootState) => state.favourite.favourites,
    )

    const [tmp, setTmp] = useState(0)

    /**
     * handleUnmark is an asynchronous function that handles unmarking an exercise as a favorite.
     *
     * @param {string} topicId - The ID of the topic.
     * @param {number} exerciseId - The ID of the exercise.
     * @returns {Promise<void>} A promise that resolves when the exercise is successfully unmarked.
     */
    const handleUnmark = useCallback(
        async (topicId: string, exerciseId: number) => {
            const response = await apiExec(DefaultApi, (api) =>
                api.exercisesApiPatchUserExercise(topicId, exerciseId, {
                    favourite: false,
                }),
            )
            if (hasFailed(response)) {
                return setError(t("general.error.favourite"))
            }
            setTmp(tmp + 1)
        },
        [setError, t, tmp],
    )

    useEffect(() => {
        dispatch(fetchFavourites()).catch(() =>
            setError(t("general.error.favourite")),
        )
    }, [dispatch, tmp, t, setError])

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(!isOpen)}
            PaperProps={{
                sx: {
                    backgroundColor: darkMode
                        ? config.THEME_COLORS.DARK
                        : config.THEME_COLORS.NEUTRAL,
                    color: darkMode
                        ? config.THEME_COLORS.NEUTRAL
                        : config.THEME_COLORS.DARK,
                    borderLeft: darkMode
                        ? `1px black solid`
                        : `1px black solid`,
                },
            }}
        >
            <p className={classes.headline}>{t("marked.title")}</p>
            {favouriteExercises?.map((favouriteExercise) => (
                <MarkedCard
                    key={favouriteExercise.enumber}
                    favouriteExercise={favouriteExercise}
                    handleUnmark={handleUnmark}
                    closeCard={() => setIsOpen(false)}
                />
            ))}
        </Drawer>
    )
}

export default Marked
