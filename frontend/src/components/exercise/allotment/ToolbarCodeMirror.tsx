// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import Toolbar, { EditorHandlers } from "../../toolbar/Toolbar"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { sql } from "@codemirror/lang-sql"
import { makeStyles } from "tss-react/mui"
import "./CodeMirror.css"

const useStyles = makeStyles()(() => ({
    codeMirror: {
        "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: "#333333",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#ffffff",
            borderRadius: "5px",
        },
    },
}))

interface Props {
    // toolbar
    editorHandlers: EditorHandlers
    disableToolbarButtons: boolean

    // CodeMirror
    height: number
    value: string
    setValue: (_: string) => void
}

/**
 * ToolbarCodeMirror component displays a toolbar and CodeMirror editor.
 *
 * @param {Props} props - Component properties.
 * @param {EditorHandlers} props.editorHandler - Callback functions for the editor.
 * @param {boolean} props.disableToolbarButtons - Flag indicating whether to disable toolbar buttons.
 * @param {string} props.height - Height of CodeMirror component.
 * @param {string} props.value - Value of the input.
 * @param {function} props.setValue - Setter for value.
 * @returns {JSX.Element} ToolbarCodeMirror component.
 */
const ToolbarCodeMirror: React.FC<Props> = (props) => {
    const { classes } = useStyles()
    const { editorHandlers, disableToolbarButtons, height, value, setValue } =
        props

    return (
        <>
            <Toolbar
                editorHandlers={editorHandlers}
                disableToolbarButtons={disableToolbarButtons}
            />
            <CodeMirror
                id="editor"
                value={value}
                theme={vscodeDark}
                className={classes.codeMirror}
                extensions={[sql()]}
                height={height - 30 + "px"}
                basicSetup={{ autocompletion: false }}
                onChange={(e: any) => setValue(e.valueOf())}
            />
        </>
    )
}

export default ToolbarCodeMirror
