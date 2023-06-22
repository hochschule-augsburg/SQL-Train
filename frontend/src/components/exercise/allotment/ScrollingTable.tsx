// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Result } from "../../../api"
import CustomTable from "../../table/CustomTable"
import { ScrollSyncPane } from "react-scroll-sync"
import { makeStyles } from "tss-react/mui"
import config from "../../../../../config.json"

const useStyles = makeStyles<{ height: number }>()((theme, { height }) => ({
    customBarDiv: {
        backgroundColor: config.THEME_COLORS.SECONDARY,
        height: height,
        overflowY: "scroll",
    },
    tableTitle: {
        position: "sticky",
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
    tableCont: Result | undefined
    hoveredRow: number
    setHoveredRow: (row: number) => void
    classNameCustomBar: string
    tableTitle: string
    height: number
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
    const {
        tableCont,
        hoveredRow,
        setHoveredRow,
        classNameCustomBar,
        tableTitle,
        height,
    } = props

    const { classes, cx } = useStyles({ height: height })

    return (
        <ScrollSyncPane>
            <div
                className={cx(
                    classNameCustomBar,
                    classes.customBarDiv,
                    "table",
                )}
            >
                <div className={classes.tableTitle}>{tableTitle}</div>
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
