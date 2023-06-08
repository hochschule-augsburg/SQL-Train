// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect, useState } from "react"
import config from "../../../config.json"
import { Result } from "../../../api"
import { AllotmentState } from "../../../pages/ExercisePage"
import { makeStyles } from "tss-react/mui"
import MobileAllotmentView from "./MobileAllotmentView"
import DesktopAllotmentView from "./DesktopAllotmentView"
import If from "../../conditional/If"

const useStyles = makeStyles()(() => ({
    divWrapper: {
        marginRight: "5%",
        marginLeft: "5%",
        display: "flex",
        height: "430px",
        marginBottom: "1%",
        backgroundColor: config.THEME_COLORS.SECONDARY,
    },
    customBarDiv: {
        height: "430px",
        overflow: "scroll",
    },
    tableTitle: {
        position: "static",
        backgroundColor: config.THEME_COLORS.SECONDARY,
        color: config.THEME_COLORS.NEUTRAL,
        borderBottom: "1px",
        borderColor: config.THEME_COLORS.NEUTRAL,
        borderBottomStyle: "solid",
        height: "29.5px",
        padding: "3px",
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
    const { classes } = useStyles()

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

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

    return (
        <>
            <If condition={windowSize.width < 450}>
                <MobileAllotmentView
                    dataModelHandler={executeDataModelHandler}
                    executeHandler={executeQueryClickHandler}
                    solutionHandler={solutionClickHandler}
                    checkHandler={checkAnswerClickHandler}
                    resetHandler={handleResetDataBase}
                    clearHandler={() => setInputQuery("")}
                    disableToolbarButtons={disableToolbarButtons}
                    className={"customBar"}
                    basicSetup={{ autocompletion: false }}
                    onChange={(e: any) => setInputQuery(e.valueOf())}
                    value={inputQuery}
                    height={"430px"}
                    tableCont={tableCont}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                    classNameCustomBar={"customBar"}
                    classNameTableTitle={classes.tableTitle}
                    allotmentState={allotmentState}
                    divWrapperClass={classes.divWrapper}
                    solutionTableCont={solutionTableCont}
                />
            </If>
            <If condition={windowSize.width >= 450}>
                <DesktopAllotmentView
                    dataModelHandler={executeDataModelHandler}
                    executeHandler={executeQueryClickHandler}
                    solutionHandler={solutionClickHandler}
                    checkHandler={checkAnswerClickHandler}
                    resetHandler={handleResetDataBase}
                    clearHandler={() => setInputQuery("")}
                    disableToolbarButtons={disableToolbarButtons}
                    className={"customBar"}
                    basicSetup={{ autocompletion: false }}
                    onChange={(e: any) => setInputQuery(e.valueOf())}
                    value={inputQuery}
                    tableCont={tableCont}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                    height={"400px"}
                    classNameCustomBar={"customBar"}
                    classNameTableTitle={classes.tableTitle}
                    allotmentState={allotmentState}
                    divWrapperClass={classes.divWrapper}
                    solutionTableCont={solutionTableCont}
                />
            </If>
        </>
    )
}

export default CustomAllotment
