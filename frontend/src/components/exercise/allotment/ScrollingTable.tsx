// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Result } from "../../../api"
import CustomTable from "../../table/CustomTable"
import { ScrollSyncPane } from "react-scroll-sync"
import { Allotment } from "allotment"
import { makeStyles } from "tss-react/mui"
import config from "../../../../../config.json"

const useStyles = makeStyles()(() => ({
    customBarDiv: {
        backgroundColor: config.THEME_COLORS.SECONDARY,
        height: "450px",
        overflowY: "scroll",
    },
}))

interface Props {
    tableCont: Result | undefined
    hoveredRow: number
    setHoveredRow: (row: number) => void
    classNameCustomBar: string
    classNameTableTitle: string
    tableTitle: string
}

/**
 * ScrollingTable component displays a scrolling table with custom bar and table title.
 *
 * @param {Props} props - Component properties.
 * @param {Result | undefined} props.tableCont - Result data for the table.
 * @param {number} props.hoveredRow - Index of the hovered row.
 * @param {function} props.setHoveredRow - Callback function for setting the hovered row.
 * @param {string} props.classNameCustomBar - CSS class name for the custom bar.
 * @param {string} props.classNameTableTitle - CSS class name for the table title.
 * @param {string} props.tableTitle - Title of the table.
 * @returns {JSX.Element} ScrollingTable component.
 */
const ScrollingTable: React.FC<Props> = (props) => {
    const { cx, classes } = useStyles()

    const {
        tableCont,
        hoveredRow,
        setHoveredRow,
        classNameCustomBar,
        classNameTableTitle,
        tableTitle,
    } = props

    return (
        <ScrollSyncPane>
            <div
                className={cx(
                    classNameCustomBar,
                    classes.customBarDiv,
                    "table",
                )}
            >
                <div className={classNameTableTitle}>{tableTitle}</div>
                <CustomTable
                    tableCont={tableCont}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                />
            </div>
        </ScrollSyncPane>
    )
}

export default ScrollingTable
