// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { IconType } from "react-icons/lib"
import { UncontrolledTooltip } from "reactstrap"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles<{ disableButton: boolean }>()(
    (theme, { disableButton }) => ({
        button: {
            background: "transparent",
            border: "none",
            cursor: `${disableButton && "not-allowed"}`,
        },
        toolbarIcon: {
            verticalAlign: "middle",
            marginInline: "5px",
            color: "white",
            outline: "none",
        },
    }),
)

interface Props {
    id: string
    iconClassName: string
    onClick?: () => void
    disableButton: boolean
    tooltipText: string
    ReactIcons?: IconType
}

/**
 * ToolbarButton component represents a button in the toolbar.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {string} props.id - Unique ID for the button.
 * @param {string} props.iconClassName - CSS class name for the button icon.
 * @param {Function} props.onClick - Handler for the button click event.
 * @param {boolean} props.disableButton - Indicates whether the button should be disabled.
 * @param {string} props.tooltipText - Text for the button tooltip.
 * @param {IconType} props.ReactIcons - Button Icon from react-icons.
 * @returns {JSX.Element} ToolbarButton component.
 */
const ToolbarButton: React.FC<Props> = (props) => {
    const {
        onClick,
        disableButton,
        id,
        iconClassName,
        tooltipText,
        ReactIcons,
    } = props

    const { classes, cx } = useStyles({ disableButton })

    return (
        <button
            aria-label={tooltipText}
            className={classes.button}
            disabled={disableButton}
            onClick={onClick}
        >
            <UncontrolledTooltip target={id}>{tooltipText}</UncontrolledTooltip>
            {ReactIcons ? (
                <ReactIcons id={id} className={classes.toolbarIcon} />
            ) : (
                <i id={id} className={cx(iconClassName, classes.toolbarIcon)} />
            )}
        </button>
    )
}

export default ToolbarButton
