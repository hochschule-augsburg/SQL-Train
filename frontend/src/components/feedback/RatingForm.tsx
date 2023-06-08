// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { FormGroup } from "reactstrap"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()(() => ({
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
}))

interface Props {
    rating: number
    setRating: (newRating: number) => void
}

/**
 * RatingForm component displays a star-based rating system.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {number} props.rating - The current rating value.
 * @param {function} props.setRating - Callback function to update the rating value.
 * @returns {JSX.Element} RatingForm component.
 */
const RatingForm: React.FC<Props> = (props) => {
    const { classes, cx } = useStyles()

    const { rating, setRating } = props

    const stars = [1, 2, 3, 4, 5]

    return (
        <FormGroup check className={classes.ratingForm}>
            {stars.map((star) => (
                <i
                    key={star}
                    className={cx(
                        rating >= star ? "bi bi-star-fill" : "bi bi-star",
                        classes.rating,
                    )}
                    style={{ color: rating >= star ? "#ffc62b" : "" }}
                    onClick={() => setRating(star)}
                />
            ))}
        </FormGroup>
    )
}

export default RatingForm
