// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useState, useContext } from "react"
import { Form, Input, Label } from "reactstrap"
import { apiExec, hasFailed } from "../../utils/ApiUtils"
import { useTranslation } from "react-i18next"
import config from "../../config.json"
import { DefaultApi } from "../../api"
import { makeStyles } from "tss-react/mui"
import CustomButton from "../button/CustomButton"
import FeedbackSection from "./FeedbackSection"
import { DarkModeContext } from "../layout/DarkModeContext"
import { Drawer } from "@mui/material"
import { Toast } from "../info/Toast"
import { ErrorContext } from "../layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    canvas: {
        paddingInline: "20px",
    },
    label: {
        fontWeight: "bold",
    },
    info: {
        paddingTop: "20px",
    },
    feedback: {
        paddingInline: "25px",
    },
    rating: {
        cursor: "pointer",
        paddingTop: "5px",
        paddingRight: "4px",
        fontSize: "22px",
    },
    form: {
        margin: "15px",
    },
    button: {
        margin: "16px",
    },
    divWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    exitButton: {
        "& button:focus": {
            boxShadow: "none !important",
        },
    },
    headline: {
        width: "398px",
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
 * Feedback component allows users to provide feedback on various aspects.
 *
 * @param {Props} props - Component properties.
 * @param {boolean} props.isOpen - Determines if the feedback component is open or not.
 * @param {Function} props.setIsOpen - Function to set the open state of the feedback component.
 * @returns {JSX.Element} Feedback component.
 */
const Feedback: React.FC<Props> = (props) => {
    const { isOpen, setIsOpen } = props
    const { t } = useTranslation("common")
    const { darkMode } = useContext(DarkModeContext)
    const { setError } = useContext(ErrorContext)
    const { classes } = useStyles()

    const [generalRating, setGeneralRating] = useState<number>(0)
    const [ratingPositiveText, setRatingPositiveText] = useState<string>("")
    const [ratingNegativeText, setRatingNegativeText] = useState<string>("")

    const [uiRating, setUiRating] = useState<number>(0)
    const [uiPositiveText, setUiPositiveText] = useState<string>("")
    const [uiNegativeText, setUiNegativeText] = useState<string>("")

    const [uxRating, setUxRating] = useState<number>(0)
    const [uxPositiveText, setUxPositiveText] = useState<string>("")
    const [uxNegativeText, setUxNegativeText] = useState<string>("")

    const [improveText, setImproveText] = useState<string>("")

    const [feedback, setFeedback] = useState<string | null>(null)

    /*
     * Handle submit function for submitting feedback.
     * It performs validation checks and makes an API request to create feedback.
     * If the request is successful, it closes the feedback component.
     *
     * @returns {Promise<void>} Promise that resolves when the submit process is complete.
     */
    const handleSubmit = useCallback(async () => {
        if (generalRating > 0 && uiRating > 0 && uxRating > 0) {
            const response = await apiExec(DefaultApi, (api) =>
                api.feedbackApiCreateFeedback({
                    general: {
                        stars: generalRating,
                        praise: ratingPositiveText,
                        criticism: ratingNegativeText,
                    },
                    ui: {
                        stars: uiRating,
                        praise: uiPositiveText,
                        criticism: uiNegativeText,
                    },
                    ux: {
                        stars: uxRating,
                        praise: uxPositiveText,
                        criticism: uxNegativeText,
                    },
                    improvements: improveText,
                }),
            )
            if (hasFailed(response)) {
                if (response.error.code === 401) {
                    setError(t("feedback.toomuch"))
                } else {
                    setError(t("general.error.unknown"))
                }
            } else {
                setFeedback(t("feedback.thx"))
                setIsOpen(false)
            }
        } else {
            setError(t("feedback.rating"))
        }
    }, [
        generalRating,
        uiRating,
        uxRating,
        ratingPositiveText,
        ratingNegativeText,
        uiPositiveText,
        uiNegativeText,
        uxPositiveText,
        uxNegativeText,
        improveText,
        setError,
        t,
        setIsOpen,
    ])

    return (
        <>
            <Toast
                message={feedback}
                positive={true}
                onClose={() => setFeedback(null)}
            />
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={() => setIsOpen(!isOpen)}
                PaperProps={{
                    sx: {
                        width: "400px",
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
                <p className={classes.headline}>Feedback</p>
                <Form className={classes.form}>
                    <FeedbackSection
                        rating={generalRating}
                        setRating={setGeneralRating}
                        positiveText={ratingPositiveText}
                        setPositiveText={setRatingPositiveText}
                        negativeText={ratingNegativeText}
                        setNegativeText={setRatingNegativeText}
                        formLabel={t("feedback.general")}
                        positiveLabel={t("feedback.positive")}
                        negativeLabel={t("feedback.negative")}
                    />

                    <FeedbackSection
                        rating={uiRating}
                        setRating={setUiRating}
                        positiveText={uiPositiveText}
                        setPositiveText={setUiPositiveText}
                        negativeText={uiNegativeText}
                        setNegativeText={setUiNegativeText}
                        formLabel={t("feedback.ui")}
                        positiveLabel={t("feedback.positive")}
                        negativeLabel={t("feedback.negative")}
                    />

                    <FeedbackSection
                        rating={uxRating}
                        setRating={setUxRating}
                        positiveText={uxPositiveText}
                        setPositiveText={setUxPositiveText}
                        negativeText={uxNegativeText}
                        setNegativeText={setUxNegativeText}
                        formLabel={t("feedback.ux")}
                        positiveLabel={t("feedback.positive")}
                        negativeLabel={t("feedback.negative")}
                    />

                    <Label className={classes.label}>
                        {t("feedback.improvements")}
                    </Label>
                    <Input
                        name="text"
                        type="textarea"
                        onChange={(e) => setImproveText(e.target.value)}
                        value={improveText}
                    />

                    <Label className={classes.info}>{t("feedback.info")}</Label>
                    <div className={classes.divWrapper}>
                        <CustomButton
                            className={classes.button}
                            text={t("feedback.submit")}
                            onClick={() => handleSubmit()}
                        />
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default Feedback
