// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import "bootstrap-icons/font/bootstrap-icons.css"
import config from "../../config.json"
import { makeStyles } from "tss-react/mui"
import ToolbarButton from "./ToolbarButton"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../store/reducers/Store"
import {
    getOperatingSystem,
    OperatingSystem,
} from "../../utils/OperatingSystemUtil"
import { FaCheck, FaPlay } from "react-icons/fa"

const useStyles = makeStyles()(() => ({
    wrapper: {
        position: "static",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: config.THEME_COLORS.SECONDARY,
        color: config.THEME_COLORS.NEUTRAL,
        borderBottom: "1px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        borderBottomStyle: "solid",
    },
}))

interface Props {
    dataModelHandler: () => void
    checkHandler: () => void
    executeHandler: () => void
    resetHandler: () => void
    solutionHandler: () => void
    clearHandler: () => void
    disableToolbarButtons: boolean
}

/**
 * Toolbar component displays a toolbar with various buttons for exercise operations.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {Function} props.dataModelHandler - Handler for the data model button click.
 * @param {Function} props.checkHandler - Handler for the check button click.
 * @param {Function} props.executeHandler - Handler for the execute button click.
 * @param {Function} props.resetHandler - Handler for the reset button click.
 * @param {Function} props.solutionHandler - Handler for the solution button click.
 * @param {Function} props.clearHandler - Handler for the clear button click.
 * @param {boolean} props.disableToolbarButtons - Indicates whether the toolbar buttons should be disabled.
 * @returns {JSX.Element} Toolbar component.
 */
const Toolbar: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const { t } = useTranslation("common")
    const exercise = useSelector(
        (state: RootState) => state.exercises.selectedExercise,
    )
    const exercises = useSelector(
        (state: RootState) => state.exercises.exercises,
    )

    const {
        dataModelHandler,
        checkHandler,
        executeHandler,
        resetHandler,
        solutionHandler,
        clearHandler,
        disableToolbarButtons,
    } = props

    const operatingSystem = getOperatingSystem()

    /**
     * keyHandler function handles the keydown event and performs specific actions based on the pressed key.
     *
     * @param {KeyboardEvent} e - The keydown event.
     * @returns {void} The function does not return a value.
     */
    const keyHandler = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "x":
                    executeHandler()
                    break
                case "s":
                    solutionHandler()
                    break
                case "y":
                case "z":
                    resetHandler()
                    break
                case "a":
                    clearHandler()
                    break
                case "c":
                    checkHandler()
                    break
                default:
                    break
            }
        },
        [
            checkHandler,
            clearHandler,
            executeHandler,
            resetHandler,
            solutionHandler,
        ],
    )

    /**
     * handleKeyDown function handles the keydown event and triggers the keyHandler based on the operating system and key combination.
     *
     * @param {KeyboardEvent} e - The keydown event.
     * @returns {void} The function does not return a value.
     */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!disableToolbarButtons) {
                if (operatingSystem === OperatingSystem.MAC && e.ctrlKey) {
                    keyHandler(e)
                } else if (
                    operatingSystem === OperatingSystem.OTHER &&
                    e.altKey
                ) {
                    keyHandler(e)
                }
            }
        },
        [keyHandler, operatingSystem, disableToolbarButtons],
    )

    /**
     * getNextENumber function returns the next exercise number as a string.
     *
     * @returns {string} The next exercise number as a string.
     */
    const getNextENumber = useCallback(() => {
        return exercise ? (exercise.enumber + 1).toString() : ""
    }, [exercise])

    /**
     * getPrevENumber function returns the previous exercise number as a string.
     *
     * @returns {string} The previous exercise number as a string.
     */
    const getPrevENumber = useCallback(() => {
        return exercise ? (exercise.enumber - 1).toString() : ""
    }, [exercise])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    return (
        <div className={classes.wrapper}>
            <div>
                <ToolbarButton
                    id={"dataModelIcon"}
                    iconClassName={"bi bi-file-earmark-text-fill"}
                    onClick={dataModelHandler}
                    disableButton={false}
                    tooltipText={t("exercise.showDataModel")}
                />
                <ToolbarButton
                    id={"execute"}
                    iconClassName={""}
                    onClick={executeHandler}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.executeQuery")
                            : t("exercise.executeQueryMac")
                    }
                    ReactIcons={FaPlay}
                />
                <ToolbarButton
                    id={"check"}
                    iconClassName={""}
                    onClick={checkHandler}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.checkAnswer")
                            : t("exercise.checkAnswerMac")
                    }
                    ReactIcons={FaCheck}
                />
                <ToolbarButton
                    id={"solution"}
                    iconClassName={"bi bi-lightbulb-fill"}
                    onClick={solutionHandler}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.solution")
                            : t("exercise.solutionMac")
                    }
                />
            </div>
            <div>
                <Link
                    to={
                        "/topic/" +
                        exercise?.topic +
                        "/exercise/" +
                        getPrevENumber()
                    }
                    style={{ textDecoration: "none" }}
                >
                    <ToolbarButton
                        id={"prevBut"}
                        iconClassName={"bi bi-skip-backward-fill"}
                        disableButton={
                            !exercises.some((e) =>
                                exercise !== undefined
                                    ? e.enumber === exercise.enumber - 1
                                    : true,
                            )
                        }
                        tooltipText={t("exercise.prev")}
                    />
                </Link>
                <Link
                    to={
                        "/topic/" +
                        exercise?.topic +
                        "/exercise/" +
                        getNextENumber()
                    }
                    style={{ textDecoration: "none" }}
                >
                    <ToolbarButton
                        id={"nextBut"}
                        iconClassName={"bi bi-skip-forward-fill"}
                        disableButton={
                            !exercises.some((e) =>
                                exercise !== undefined
                                    ? e.enumber === exercise.enumber + 1
                                    : true,
                            )
                        }
                        tooltipText={t("exercise.next")}
                    />
                </Link>
                <ToolbarButton
                    id={"reset"}
                    iconClassName={"bi bi-arrow-clockwise"}
                    onClick={resetHandler}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.resetDB")
                            : t("exercise.resetDBMac")
                    }
                />
                <ToolbarButton
                    id={"clear"}
                    iconClassName={"bi bi-trash-fill"}
                    onClick={clearHandler}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.clear")
                            : t("exercise.clearMac")
                    }
                />
            </div>
        </div>
    )
}

export default Toolbar
