// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Table } from "reactstrap"
import { Result } from "../../api"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    head: {
        position: "sticky",
        top: "0",
    },
}))

interface Props {
    tableCont: Result | undefined
    hoveredRow: number
    setHoveredRow: (row: number) => void
}

/**
 * CustomTable component displays a custom table with dynamic content.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {Result|undefined} props.tableCont - The table content.
 * @param {number} props.hoveredRow - The index of the hovered row.
 * @param {Function} props.setHoveredRow - Function to set the hovered row index.
 * @returns {JSX.Element} CustomTable component.
 */
const CustomTable: React.FC<Props> = (props) => {
    const { classes, cx } = useStyles()

    const { tableCont, hoveredRow, setHoveredRow } = props

    return (
        <Table striped={true} dark={true} size="sm">
            <thead>
                <tr>
                    {tableCont &&
                        Object.keys(tableCont.result[0]).map((key) => (
                            <th
                                key={key}
                                className={cx(
                                    tableCont?.miss_cols?.includes(key) &&
                                        "table-danger",
                                    classes.head,
                                )}
                            >
                                {String(key)}
                            </th>
                        ))}
                </tr>
            </thead>
            <tbody>
                {tableCont?.result.map((row: any, index: number) => {
                    return (
                        <tr
                            key={index}
                            // TODO: right color
                            className={
                                hoveredRow >= 0 && index == hoveredRow
                                    ? "table-info"
                                    : tableCont?.miss_rows?.includes(index)
                                    ? "table-danger"
                                    : ""
                            }
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(-1)}
                        >
                            {tableCont &&
                                Object.keys(tableCont.result[0]).map((cell) => {
                                    return (
                                        <td key={cell}>{String(row[cell])}</td>
                                    )
                                })}
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default CustomTable
