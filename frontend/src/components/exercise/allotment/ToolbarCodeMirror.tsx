// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import Toolbar, { EditorHandlers } from "../../toolbar/Toolbar"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { sql } from "@codemirror/lang-sql"
import { Allotment } from "allotment"

interface Props {
    editorHandlers: EditorHandlers
    // toolbar
    disableToolbarButtons: boolean

    // codemirror
    className: string
    height: number
    value: string
    setValue: (_: string) => void
}

/**
 * ToolbarCodeMirror component displays a toolbar and CodeMirror editor.
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
 * @param {string} props.height - Height of codemirror component.
 * @param {Object} props.basicSetup - Basic setup configuration.
 * @param {boolean} props.basicSetup.autocompletion - Flag indicating whether autocompletion is enabled.
 * @param {function} props.onChange - Callback function for handling input change.
 * @param {string} props.value - Value of the input.
 * @returns {JSX.Element} ToolbarCodeMirror component.
 */
const ToolbarCodeMirror: React.FC<Props> = (props) => {
    const {
        editorHandlers,
        disableToolbarButtons,
        className,
        height,
        value,
        setValue,
    } = props

    return (
        <>
            <Toolbar
                editorHandlers={editorHandlers}
                disableToolbarButtons={disableToolbarButtons}
            />
            <CodeMirror
                id="editor"
                className={className}
                value={value}
                theme={vscodeDark}
                extensions={[sql()]}
                height={height - 30 + "px"}
                basicSetup={{ autocompletion: false }}
                onChange={(e: any) => setValue(e.valueOf())}
            />
        </>
    )
}

export default ToolbarCodeMirror
