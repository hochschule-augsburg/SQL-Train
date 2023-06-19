// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useEffect, useMemo } from "react"
import { useDispatch } from "react-redux"
import { makeStyles } from "tss-react/mui"
import config from "../../../../config.json"
import {
    Autocomplete,
    TextField,
    Chip,
    FilterOptionsState,
} from "@mui/material"
import { createFilterOptions } from "@mui/material/Autocomplete"
import { FOTypes, FilterOption } from "../../store/reducers/filter"
import { useTranslation } from "react-i18next"
import { AnyAction } from "redux"

const useStyles = makeStyles()(() => ({
    searchInput: {
        width: "50%",
        margin: "1.5%",
        marginBottom: "0px",
        color: config.THEME_COLORS.DARK,
        backgroundColor: `${config.THEME_COLORS.NEUTRAL}b3`,
        border: "solid",
        borderWidth: "1px",
        borderColor: config.THEME_COLORS.DARK,
        borderRadius: "5px",
    },
}))

interface Props {
    showResultHandler: (to: boolean) => void
    showResult: boolean
    opts: FilterOption[]
    selOpts: FilterOption[]
    selectHandler: (newValue: FilterOption[]) => AnyAction
}

/**
 * SearchBar component displays a search bar with filter options.
 *
 * @param {Props} props - Component properties.
 * @param {function} props.showResultHandler - Callback function to handle showing/hiding the search results.
 * @param {boolean} props.showResult - Flag indicating whether to show the search results.
 * @returns {JSX.Element} SearchBar component.
 */
const SearchBar: React.FC<Props> = (props) => {
    const { t } = useTranslation("common")

    const dispatch = useDispatch()
    const { classes } = useStyles()

    const { showResult, showResultHandler, opts, selOpts, selectHandler } =
        props

    /**
     * getLabel is a callback function that returns the label for a filter option.
     *
     * @param {FilterOption} option - The filter option.
     * @returns {string} The label for the filter option.
     */
    const getLabel = useCallback(
        (option: FilterOption) => {
            const label =
                option.type !== FOTypes.EDiff
                    ? option.name
                    : t(`difficulty.${option.name}`)
            return `${label} - ${t(`FOTypes.${option.type}`)}`
        },
        [t],
    )

    /**
     * handleSearch is a callback function that handles the search action.
     * It triggers the showResultHandler based on the number of selected filter options.
     *
     * @returns {void}
     */
    const handleSearch = useCallback(() => {
        showResultHandler(selOpts.length > 0)
    }, [selOpts.length, showResultHandler])

    const filter = useMemo(() => {
        return createFilterOptions<FilterOption>()
    }, [])

    /**
     * filterOptionHandler is a callback function that filters the available options based on the input value and filter parameters.
     *
     * @param {FilterOption[]} options - The available filter options.
     * @param {FilterOptionsState<FilterOption>} params - The filter options state, including the input value.
     * @returns {FilterOption[]} The filtered options.
     */
    const filterOptionHandler = useCallback(
        (options: FilterOption[], params: FilterOptionsState<FilterOption>) => {
            const filtered = filter(options, params)
            const { inputValue } = params
            if (inputValue !== "") {
                filtered.unshift({
                    name: `${inputValue}`,
                    type: FOTypes.TTitle,
                })
                filtered.unshift({
                    name: `${inputValue}`,
                    type: FOTypes.ETitle,
                })
            }
            return filtered
        },
        [filter],
    )

    /**
     * getOptionLabel is a callback function that returns the label for a filter option.
     *
     * @param {FilterOption} option - The filter option.
     * @returns {string} The label for the filter option.
     */
    const getOptionLabel = useCallback(
        (option: FilterOption) => {
            return getLabel(option)
        },
        [getLabel],
    )

    useEffect(() => {
        handleSearch()
    }, [showResult, handleSearch])

    return (
        <>
            <Autocomplete
                className={classes.searchInput}
                multiple
                options={opts}
                filterSelectedOptions
                value={selOpts}
                onChange={(event, value) => dispatch(selectHandler(value))}
                filterOptions={filterOptionHandler}
                getOptionLabel={getOptionLabel}
                renderInput={(params) => (
                    <TextField {...params} placeholder="Search" />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={getLabel(option)}
                            {...getTagProps({ index })}
                            key={index}
                        />
                    ))
                }
            />
        </>
    )
}

export default SearchBar
