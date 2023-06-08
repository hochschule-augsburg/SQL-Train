// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Button } from "reactstrap"
import { makeStyles } from "tss-react/mui"
import config from "../../config.json"

const useStyles = makeStyles<{ selected: boolean | undefined }>()(
    (theme, { selected }) => ({
        wrapper: {
            display: "flex",
            justifyContent: "center",
        },
        button: {
            backgroundColor: config.THEME_COLORS.SECONDARY,
            paddingRight: "15px",
            paddingLeft: "15px",
            paddingTop: "0px",
            paddingBottom: "0px",
            marginLeft: "5px",
            marginRight: "5px",
            marginTop: "3px",
            marginBottom: "3px",
            borderWidth: "2px",
            borderColor: selected
                ? config.THEME_COLORS.PRIMARY
                : config.THEME_COLORS.NEUTRAL,
        },
    }),
)

interface Props {
    className?: string
    text: string
    id?: string
    selected?: boolean
    onClick?: () => void
}

/**
 * FilterTag component displays a filter tag button.
 *
 * @param {Props} props - Component properties.
 * @param {string} props.className - CSS class name for the component.
 * @param {string} props.text - Text content of the filter tag.
 * @param {string} props.id - Unique identifier for the filter tag.
 * @param {boolean} props.selected - Flag indicating whether the filter tag is selected.
 * @param {function} props.onClick - Callback function triggered when the filter tag is clicked.
 * @returns {JSX.Element} FilterTag component.
 */
const FilterTag: React.FC<Props> = (props) => {
    const { onClick, text, id, selected } = props

    const { classes, cx } = useStyles({ selected: selected })

    return (
        <div className={classes.wrapper}>
            <Button
                onClick={onClick}
                className={cx(classes.button, props.className)}
                id={id}
                size="sm"
            >
                {text}
            </Button>
        </div>
    )
}

export default FilterTag
