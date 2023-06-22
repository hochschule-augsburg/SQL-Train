// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect, useState } from "react"
import config from "../../../../../config.json"
import { Result } from "../../../api"
import { AllotmentState } from "../../../pages/ExercisePage"
import { makeStyles } from "tss-react/mui"
import { ScrollSync } from "react-scroll-sync"
import { Allotment } from "allotment"
import ToolbarCodeMirror from "./ToolbarCodeMirror"
import ScrollingTable from "./ScrollingTable"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles<{ height: number }>()((theme, { height }) => ({
    divWrapper: {
        marginRight: "5%",
        marginLeft: "5%",
        display: "flex",
        marginBottom: "1%",
        height: height,
        backgroundColor: config.THEME_COLORS.SECONDARY,
    },
    easeTrans: {
        transition: "all 0.15s ease-in-out",
        willChange: "width",
    },
}))

interface Props {
    executeDataModelHandler: () => void
    executeQueryClickHandler: () => void
    solutionClickHandler: () => void
    checkAnswerClickHandler: () => void
    handleResetDataBase: () => void
    inputQuery: string
    setInputQuery: (input: string) => void
    tableCont: Result | undefined
    solutionTableCont: Result | undefined
    disableToolbarButtons: boolean
    allotmentState: AllotmentState | undefined
}

/**
 * CustomAllotment component displays the main interface for executing queries and displaying results.
 *
 * @param {Props} props - Component properties.
 * @param {function} props.executeDataModelHandler - Callback function for executing data model.
 * @param {function} props.executeQueryClickHandler - Callback function for executing query.
 * @param {function} props.solutionClickHandler - Callback function for displaying solution.
 * @param {function} props.checkAnswerClickHandler - Callback function for checking answer.
 * @param {function} props.handleResetDataBase - Callback function for resetting the database.
 * @param {string} props.inputQuery - Input query value.
 * @param {function} props.setInputQuery - Callback function for updating the input query value.
 * @param {Result | undefined} props.tableCont - Result data for the main table.
 * @param {Result | undefined} props.solutionTableCont - Result data for the solution table.
 * @param {boolean} props.disableToolbarButtons - Flag indicating whether to disable toolbar buttons.
 * @param {AllotmentState | undefined} props.allotmentState - Current state of the allotment.
 * @returns {JSX.Element} CustomAllotment component.
 */
const CustomAllotment: React.FC<Props> = (props) => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const [height, setHeight] = useState(windowSize.width <= 450 ? 1000 : 450)
    const { classes } = useStyles({ height: height })
    const { t } = useTranslation("common")

    useEffect(() => {
        window.onresize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
    }, [])

    const {
        executeDataModelHandler,
        executeQueryClickHandler,
        solutionClickHandler,
        checkAnswerClickHandler,
        handleResetDataBase,
        inputQuery,
        setInputQuery,
        tableCont,
        solutionTableCont,
        disableToolbarButtons,
        allotmentState,
    } = props

    const [hoveredRow, setHoveredRow] = useState<number>(-1)
    const [trans, setTrans] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setTrans(true)
        setTimeout(
            () =>
                setVisible(
                    allotmentState == AllotmentState.SOLUTION ||
                        allotmentState == AllotmentState.CHECK,
                ),
            10,
        )
        setTimeout(() => setTrans(false), 150)
    }, [allotmentState])

    useEffect(() => {
        setHeight(windowSize.width <= 450 ? 1000 : 450)
    }, [windowSize.width])

    return (
        <div className={classes.divWrapper}>
            <ScrollSync>
                <Allotment snap vertical={windowSize.width <= 450}>
                    <Allotment.Pane preferredSize={"33%"}>
                        <ToolbarCodeMirror
                            editorHandlers={{
                                showDataModel: executeDataModelHandler,
                                executeQuery: executeQueryClickHandler,
                                showSolution: solutionClickHandler,
                                checkAnswer: checkAnswerClickHandler,
                                resetDb: handleResetDataBase,
                                clearEditor: () => setInputQuery(""),
                            }}
                            disableToolbarButtons={disableToolbarButtons}
                            className={"customBar"}
                            height={height}
                            value={inputQuery}
                            setValue={setInputQuery}
                        />
                    </Allotment.Pane>

                    <Allotment.Pane
                        className={trans ? classes.easeTrans : ""}
                        preferredSize={"33%"}
                    >
                        <ScrollingTable
                            tableTitle={t("exercise.queryTableTitle")}
                            tableCont={tableCont}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            classNameCustomBar={"customBar"}
                            height={height}
                        />
                    </Allotment.Pane>

                    <Allotment.Pane
                        className={trans ? classes.easeTrans : ""}
                        visible={visible}
                        preferredSize={"33%"}
                        minSize={windowSize.width <= 450 ? 300 : undefined}
                    >
                        <ScrollingTable
                            tableTitle={t("exercise.solutionTableTitle")}
                            tableCont={solutionTableCont}
                            hoveredRow={hoveredRow}
                            setHoveredRow={setHoveredRow}
                            classNameCustomBar={"customBar"}
                            height={height}
                        />
                    </Allotment.Pane>
                </Allotment>
            </ScrollSync>
        </div>
    )
}

export default CustomAllotment
