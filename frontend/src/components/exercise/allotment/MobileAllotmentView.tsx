// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Allotment } from "allotment"
import { AllotmentState } from "../../../pages/ExercisePage"
import { ScrollSync } from "react-scroll-sync"
import { Result } from "../../../api"
import { useTranslation } from "react-i18next"
import ScrollingTable from "./ScrollingTable"
import ToolbarCodeMirror from "./ToolbarCodeMirror"

interface Props {
    // toolbar
    dataModelHandler: () => void
    executeHandler: () => void
    solutionHandler: () => void
    checkHandler: () => void
    resetHandler: () => void
    clearHandler: () => void
    disableToolbarButtons: boolean

    // coldmirror
    className: string
    basicSetup: { autocompletion: boolean }
    onChange: (e: any) => void
    value: string
    height: string
    divWrapperClass: string

    tableCont: Result | undefined
    solutionTableCont: Result | undefined
    hoveredRow: number
    setHoveredRow: (row: number) => void
    classNameCustomBar: string
    classNameTableTitle: string
    allotmentState: AllotmentState | undefined
}

/**
 * DesktopAllotmentView component displays a mobile view of the main interface for executing queries and displaying results.
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
 * @param {string} props.height - Height of the component.
 * @param {string} props.divWrapperClass - CSS class name for the component wrapper.
 * @param {Result | undefined} props.tableCont - Result data for the main table.
 * @param {Result | undefined} props.solutionTableCont - Result data for the solution table.
 * @param {number} props.hoveredRow - Index of the hovered row.
 * @param {function} props.setHoveredRow - Callback function for setting the hovered row.
 * @param {string} props.classNameCustomBar - CSS class name for the custom toolbar.
 * @param {string} props.classNameTableTitle - CSS class name for the table title.
 * @param {AllotmentState | undefined} props.allotmentState - Current state of the allotment.
 * @returns {JSX.Element} DesktopAllotmentView component.
 */
const MobileAllotmentView: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")

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
        height,
        divWrapperClass,
        tableCont,
        hoveredRow,
        setHoveredRow,
        classNameCustomBar,
        classNameTableTitle,
        solutionTableCont,
        allotmentState,
    } = props

    return (
        <ScrollSync>
            <div>
                <div className={divWrapperClass}>
                    <ToolbarCodeMirror
                        dataModelHandler={dataModelHandler}
                        executeHandler={executeHandler}
                        solutionHandler={solutionHandler}
                        checkHandler={checkHandler}
                        resetHandler={resetHandler}
                        clearHandler={clearHandler}
                        disableToolbarButtons={disableToolbarButtons}
                        className={className}
                        basicSetup={basicSetup}
                        onChange={onChange}
                        value={value}
                        height={height}
                    />
                </div>
                <div className={divWrapperClass}>
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
                </div>

                {(allotmentState == AllotmentState.SOLUTION ||
                    allotmentState == AllotmentState.CHECK) && (
                    <div className={divWrapperClass}>
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
                    </div>
                )}
            </div>
        </ScrollSync>
    )
}

export default MobileAllotmentView
