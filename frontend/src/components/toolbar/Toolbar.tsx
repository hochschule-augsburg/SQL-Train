// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import "bootstrap-icons/font/bootstrap-icons.css"
import config from "../../../../config.json"
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
        position: "sticky",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: config.THEME_COLORS.SECONDARY,
        color: config.THEME_COLORS.NEUTRAL,
        borderBottom: "1px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        borderBottomStyle: "solid",
    },
    link: {
        textDecoration: "none",
    },
}))

export interface EditorHandlers {
    showDataModel: () => void
    executeQuery: () => void
    checkAnswer: () => void
    showSolution: () => void
    resetDb: () => void
    clearEditor: () => void
}

interface Props {
    editorHandlers: EditorHandlers
    disableToolbarButtons: boolean
}

/**
 * Toolbar component displays a toolbar with various buttons for exercise operations.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {boolean} props.disableToolbarButtons - Indicates whether the toolbar buttons should be disabled.
 * @param {EditorHandlers} props.editorHandler - Callback functions for the editor.
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

    const { editorHandlers, disableToolbarButtons } = props

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
                    editorHandlers.executeQuery()
                    break
                case "c":
                    editorHandlers.checkAnswer()
                    break
                case "s":
                    editorHandlers.showSolution()
                    break
                case "y":
                case "z":
                    editorHandlers.resetDb()
                    break
                case "a":
                    editorHandlers.clearEditor()
                    break
                default:
                    break
            }
        },
        [editorHandlers],
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
        <div className={classes.wrapper} id="toolbar">
            <div>
                <ToolbarButton
                    id="dataModelIcon"
                    iconClassName={"bi bi-file-earmark-text-fill"}
                    onClick={editorHandlers.showDataModel}
                    disableButton={false}
                    tooltipText={t("exercise.showDataModel")}
                />
                <ToolbarButton
                    id="execute"
                    iconClassName={""}
                    onClick={editorHandlers.executeQuery}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.executeQuery")
                            : t("exercise.executeQueryMac")
                    }
                    ReactIcons={FaPlay}
                />
                <ToolbarButton
                    id="check"
                    iconClassName={""}
                    onClick={editorHandlers.checkAnswer}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.checkAnswer")
                            : t("exercise.checkAnswerMac")
                    }
                    ReactIcons={FaCheck}
                />
                <ToolbarButton
                    id="solution"
                    iconClassName={"bi bi-lightbulb-fill"}
                    onClick={editorHandlers.showSolution}
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
                    className={classes.link}
                >
                    <ToolbarButton
                        id="prevBut"
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
                    className={classes.link}
                >
                    <ToolbarButton
                        id="nextBut"
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
                    id="reset"
                    iconClassName={"bi bi-arrow-clockwise"}
                    onClick={editorHandlers.resetDb}
                    disableButton={disableToolbarButtons}
                    tooltipText={
                        operatingSystem === OperatingSystem.OTHER
                            ? t("exercise.resetDB")
                            : t("exercise.resetDBMac")
                    }
                />
                <ToolbarButton
                    id="clear"
                    iconClassName={"bi bi-trash-fill"}
                    onClick={editorHandlers.clearEditor}
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
