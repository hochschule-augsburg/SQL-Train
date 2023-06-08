// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useEffect, useState } from "react"
import { ScrollSync } from "react-scroll-sync"
import { Allotment } from "allotment"
import { AllotmentState } from "../../../pages/ExercisePage"
import { useTranslation } from "react-i18next"
import { Result } from "../../../api"
import ToolbarCodeMirror from "./ToolbarCodeMirror"
import ScrollingTable from "./ScrollingTable"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    easeTrans: {
        transition: "all 0.15s ease-in-out",
        willChange: "width",
    },
}))

interface Props {
    // toolbar
    dataModelHandler: () => void
    executeHandler: () => void
    solutionHandler: () => void
    checkHandler: () => void
    resetHandler: () => void
    clearHandler: () => void
    disableToolbarButtons: boolean

    // codemirror
    className: string
    basicSetup: { autocompletion: boolean }
    onChange: (e: any) => void
    value: string
    divWrapperClass: string

    tableCont: Result | undefined
    solutionTableCont: Result | undefined
    hoveredRow: number
    setHoveredRow: (row: number) => void
    height: string
    classNameCustomBar: string
    classNameTableTitle: string
    allotmentState: AllotmentState | undefined
}

/**
 * DesktopAllotmentView component displays a desktop view of the main interface for executing queries and displaying results.
 *
 * @param {Props} props - Component properties.
 * @param {function} props.dataModelHandler - Callback function for handling the data model.
 * @param {function} props.executeHandler - Callback function for executing the query.
 * @param {function} props.solutionHandler - Callback function for displaying the solution.
 * @param {function} props.checkHandler - Callback function for checking the answer.
 * @param {function} props.resetHandler - Callback function for resetting the view.
 * @param {function} props.clearHandler - Callback function for clearing the view.
 * @param {boolean} props.disableToolbarButtons - Flag indicating whether to disable toolbar buttons.
 * @param {string} props.className - CSS class name for the component.
 * @param {Object} props.basicSetup - Basic setup configuration.
 * @param {boolean} props.basicSetup.autocompletion - Flag indicating whether autocompletion is enabled.
 * @param {function} props.onChange - Callback function for handling input change.
 * @param {string} props.value - Value of the input.
 * @param {string} props.divWrapperClass - CSS class name for the component wrapper.
 * @param {Result | undefined} props.tableCont - Result data for the main table.
 * @param {Result | undefined} props.solutionTableCont - Result data for the solution table.
 * @param {number} props.hoveredRow - Index of the hovered row.
 * @param {function} props.setHoveredRow - Callback function for setting the hovered row.
 * @param {string} props.height - Height of codemirror component.
 * @param {string} props.classNameCustomBar - CSS class name for the custom toolbar.
 * @param {string} props.classNameTableTitle - CSS class name for the table title.
 * @param {AllotmentState | undefined} props.allotmentState - Current state of the allotment.
 * @returns {JSX.Element} DesktopAllotmentView component.
 */
const DesktopAllotmentView: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")

    const { cx, classes } = useStyles()

    const {
        dataModelHandler,
        executeHandler,
        solutionHandler,
        checkHandler,
        resetHandler,
        clearHandler,
        disableToolbarButtons,
        className,
        basicSetup,
        onChange,
        value,
        divWrapperClass,
        tableCont,
        hoveredRow,
        setHoveredRow,
        height,
        classNameCustomBar,
        classNameTableTitle,
        solutionTableCont,
        allotmentState,
    } = props

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

    return (
        <div className={divWrapperClass}>
            <ScrollSync>
                <Allotment snap={true}>
                    <Allotment.Pane preferredSize={"33%"} minSize={200}>
                        <ToolbarCodeMirror
                            dataModelHandler={dataModelHandler}
                            executeHandler={executeHandler}
                            solutionHandler={solutionHandler}
                            checkHandler={checkHandler}
                            resetHandler={resetHandler}
                            clearHandler={clearHandler}
                            disableToolbarButtons={disableToolbarButtons}
                            className={className}
                            height={height}
                            basicSetup={basicSetup}
                            onChange={onChange}
                            value={value}
                        />
                    </Allotment.Pane>

                    <Allotment.Pane
                        className={trans ? cx(classes.easeTrans) : ""}
                        preferredSize={"33%"}
                    >
                        <Allotment vertical separator={false}>
                            <ScrollingTable
                                tableTitle={t("exercise.queryTableTitle")}
                                tableCont={tableCont}
                                hoveredRow={hoveredRow}
                                setHoveredRow={setHoveredRow}
                                classNameCustomBar={classNameCustomBar}
                                classNameTableTitle={classNameTableTitle}
                            />
                        </Allotment>
                    </Allotment.Pane>

                    <Allotment.Pane
                        className={trans ? cx(classes.easeTrans) : ""}
                        visible={visible}
                        preferredSize={"33%"}
                        minSize={400}
                    >
                        <Allotment vertical separator={false}>
                            <ScrollingTable
                                tableTitle={t("exercise.solutionTableTitle")}
                                tableCont={solutionTableCont}
                                hoveredRow={hoveredRow}
                                setHoveredRow={setHoveredRow}
                                classNameCustomBar={classNameCustomBar}
                                classNameTableTitle={classNameTableTitle}
                            />
                        </Allotment>
                    </Allotment.Pane>
                </Allotment>
            </ScrollSync>
        </div>
    )
}

export default DesktopAllotmentView
