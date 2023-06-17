// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import config from "../../../../config.json"
import { FormGroup, Input, Label } from "reactstrap"
import RatingForm from "./RatingForm"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
    canvas: {
        paddingInline: "20px",
    },
    label: {
        fontWeight: "bold",
    },
    rating: {
        cursor: "pointer",
        paddingTop: "5px",
        paddingRight: "4px",
        fontSize: "22px",
    },
    ratingForm: {
        display: "flex",
        justifyContent: "space-evenly",
        padding: "0px",
        marginBottom: "30px",
    },
    button: {
        margin: "16px",
    },
    divWrapper: {
        display: "flex",
        justifyContent: "space-between",
    },
    input: {
        backgroundColor: `${config.THEME_COLORS.NEUTRAL}b3`,
    },
}))

interface Props {
    rating: number
    setRating: (newRating: number) => void
    positiveText: string
    setPositiveText: (text: string) => void
    negativeText: string
    setNegativeText: (text: string) => void
    formLabel: string
    positiveLabel: string
    negativeLabel: string
}

/**
 * Feedback component allows users to provide feedback on various aspects.
 *
 * @param {Props} props - Component properties.
 * @param {number} props.rating - The current rating value.
 * @param {function} props.setRating - Callback function to update the rating value.
 * @param {string} props.positiveText - The current positive feedback text.
 * @param {function} props.setPositiveText - Callback function to update the positive feedback text.
 * @param {string} props.negativeText - The current negative feedback text.
 * @param {function} props.setNegativeText - Callback function to update the negative feedback text.
 * @param {string} props.formLabel - The label for the feedback form.
 * @param {string} props.positiveLabel - The label for the positive feedback textarea.
 * @param {string} props.negativeLabel - The label for the negative feedback textarea.
 * @returns {JSX.Element} Feedback component.
 */
const FeedbackSection: React.FC<Props> = (props) => {
    const { classes } = useStyles()

    const {
        rating,
        setRating,
        positiveText,
        setPositiveText,
        negativeText,
        setNegativeText,
        formLabel,
        positiveLabel,
        negativeLabel,
    } = props

    return (
        <FormGroup>
            <Label className={classes.label}>{formLabel}</Label>
            <FormGroup>
                <Label>{positiveLabel}</Label>
                <Input
                    className={classes.input}
                    name="text"
                    type="textarea"
                    onChange={(e) => setPositiveText(e.target.value)}
                    value={positiveText}
                />
            </FormGroup>
            <FormGroup>
                <Label>{negativeLabel}</Label>
                <Input
                    className={classes.input}
                    name="text"
                    type="textarea"
                    onChange={(e) => setNegativeText(e.target.value)}
                    value={negativeText}
                />
            </FormGroup>
            <RatingForm rating={rating} setRating={setRating} />
        </FormGroup>
    )
}

export default FeedbackSection
