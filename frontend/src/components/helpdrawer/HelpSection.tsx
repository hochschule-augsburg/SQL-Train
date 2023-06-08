// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    headline: {
        paddingLeft: "10px",
        textDecoration: "underline",
        fontWeight: "bold",
    },
    text_part: {
        paddingLeft: "10px",
        whiteSpace: "pre-line",
    },
    sectionPicture: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "97%",
    },
}))

interface Props {
    sectionTitle: string
    sectionText: string
    pictureType: string
    additionalText: string
}

/**
 * @param {string} props.sectionTitle - The title of the helpSection
 * @param {string} props.sectionText - The text of the helpSection
 * @param {string} props.pictureType - The image that belongs to the helpSection
 * @param {string} props.additionalText - Additional text of the helpSection if more space is needed
 * @returns {JSX.Element} HelpSection component
 */

const HelpSection: React.FC<Props> = (props) => {
    const { sectionTitle, sectionText, pictureType, additionalText } = props
    const { classes } = useStyles()

    return (
        <div>
            <p className={classes.headline}>{sectionTitle}</p>
            <p className={classes.text_part}>{sectionText}</p>
            <img className={classes.sectionPicture} src={pictureType}></img>

            {additionalText && (
                <p className={classes.text_part}>{additionalText}</p>
            )}
            <hr></hr>
        </div>
    )
}

export default HelpSection
