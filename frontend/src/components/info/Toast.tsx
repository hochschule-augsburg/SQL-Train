// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Alert, Snackbar } from "@mui/material"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    toast: {
        width: "100%",
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
    },
}))

interface Props {
    message: string | null
    onClose: () => void
    positive?: boolean
}

/**
 * Toast component displays a message in a collapsible alert.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {string} props.message - The message to be displayed in the toast.
 * @param {function} [props.onClose] - Callback function to handle the toast close event.
 * @param {boolean} [props.positive] - Optional flag indicating if the toast should have a positive styling. Default is negative.
 * @returns {JSX.Element} Toast component.
 */
export const Toast: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    return (
        <Snackbar
            open={props.message !== null}
            onClose={props.onClose}
            autoHideDuration={2000}
            className={classes.wrapper}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                severity={props.positive ? "success" : "error"}
                className={classes.toast}
            >
                {props.message}
            </Alert>
        </Snackbar>
    )
}
