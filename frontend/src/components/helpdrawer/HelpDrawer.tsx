// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useContext } from "react"
import { Drawer } from "@mui/material"
import { useTranslation } from "react-i18next"
import config from "../../config.json"
import { makeStyles } from "tss-react/mui"
import { DarkModeContext } from "../layout/DarkModeContext"
import HelpSection from "./HelpSection"
import enNavi from "../../assets/helpPictures/en-navi.png"
import enTopic from "../../assets/helpPictures/en-topic.png"
import enExercises from "../../assets/helpPictures/en-exercises.png"
import enEditor from "../../assets/helpPictures/en-exercise.png"
import deNavi from "../../assets/helpPictures/de-navi.png"
import deTopic from "../../assets/helpPictures/de-topic.png"
import deExercises from "../../assets/helpPictures/de-exercises.png"
import deEditor from "../../assets/helpPictures/de-exercise.png"

const useStyles = makeStyles()(() => ({
    helpDrawer: {
        width: "100%",
        lineHeight: "41px",
        textAlign: "center",
        padding: "10px 0px",
        fontSize: "20px",
        backgroundColor: config.THEME_COLORS.PRIMARY,
        color: config.THEME_COLORS.NEUTRAL,
    },
}))

interface Props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

/**
 * HelpDrawer component allows users to look up the guide on how to operate the sql-train in a
 * MUI Drawer
 *
 * @param {Props} props - Component properties.
 * @param {boolean} props.isOpen - Determines if the helpDrawer component is open or not.
 * @param {Function} props.setIsOpen - Function to set the open state of the helpDrawer component.
 * @returns {JSX.Element} Help_Bar component.
 */

const HelpDrawer: React.FC<Props> = (props) => {
    const { isOpen, setIsOpen } = props
    const { darkMode } = useContext(DarkModeContext)
    const { classes } = useStyles()
    const { t, i18n } = useTranslation("common")

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(!isOpen)}
            PaperProps={{
                sx: {
                    width: "40%",
                    backgroundColor: darkMode
                        ? config.THEME_COLORS.DARK
                        : config.THEME_COLORS.NEUTRAL,
                    color: darkMode
                        ? config.THEME_COLORS.NEUTRAL
                        : config.THEME_COLORS.DARK,
                    borderLeft: darkMode
                        ? `1px black solid`
                        : `1px black solid`,
                },
            }}
        >
            <p className={classes.helpDrawer}>{t("help.help")}</p>
            <HelpSection
                sectionTitle={t("help.navigationBarTitle")}
                sectionText={t("help.navigationBarText")}
                pictureType={i18n.language === "EN" ? enNavi : deNavi}
                additionalText=""
            ></HelpSection>
            <HelpSection
                sectionTitle={t("help.topicPageTitle")}
                sectionText={t("help.topicPageText")}
                pictureType={i18n.language === "EN" ? enTopic : deTopic}
                additionalText=""
            ></HelpSection>
            <HelpSection
                sectionTitle={t("help.exercisesPageTitle")}
                sectionText={t("help.exercisesPageText")}
                pictureType={i18n.language === "EN" ? enExercises : deExercises}
                additionalText=""
            ></HelpSection>
            <HelpSection
                sectionTitle={t("help.editorPageTitle")}
                sectionText={t("help.editorPageText1")}
                pictureType={i18n.language === "EN" ? enEditor : deEditor}
                additionalText={t("help.editorPageText2")}
            ></HelpSection>
        </Drawer>
    )
}
export default HelpDrawer
