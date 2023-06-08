// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback } from "react"
import { Stats as StatsInterface } from "../../api"
import Stat from "./Stat"
import { RootState } from "../../store/reducers/Store"
import { useSelector } from "react-redux"
import StatDiagram from "./StatDiagram"
import { Labels } from "../../pages/StatsPage"

interface Props {
    isSearchResult: boolean
    index: number
    stats?: StatsInterface[]
}

/**
 * ExerciseButton component displays a button for an exercise.
 *
 * @param {Props} props - Component properties.
 * @param {number} props.isSearchResult - True if search result.
 * @param {number} props.index - Topic index.
 * @param {StatsInterface[]} props.stats - Stats.
 * @returns {JSX.Element} Stat component.
 */

const Stats: React.FC<Props> = (props) => {
    const search = useSelector((state: RootState) => state.profSearch)
    const { isSearchResult, index, stats } = props

    const getTouched = useCallback((): number => {
        let source: StatsInterface
        if (isSearchResult && search.results) {
            source = search.results
        } else {
            source = (stats as StatsInterface[])[index]
        }
        return source.started
    }, [index, isSearchResult, search.results, stats])

    const getUntouched = useCallback((): number => {
        let source: StatsInterface
        if (isSearchResult && search.results) {
            source = search.results
        } else {
            source = (stats as StatsInterface[])[index]
        }
        return source.total - source.started - source.correct - source.wrong
    }, [index, isSearchResult, search.results, stats])

    const getCorrect = useCallback((): number => {
        let source: StatsInterface
        if (isSearchResult && search.results) {
            source = search.results
        } else {
            source = (stats as StatsInterface[])[index]
        }
        return source.correct
    }, [index, isSearchResult, search.results, stats])

    const getWrong = useCallback((): number => {
        let source: StatsInterface
        if (isSearchResult && search.results) {
            source = search.results
        } else {
            source = (stats as StatsInterface[])[index]
        }
        return source.wrong
    }, [index, isSearchResult, search.results, stats])

    const getRel = useCallback(
        (value: number): number => {
            let total: number
            if (isSearchResult && search.results) {
                total = search.results.total
            } else {
                total = (stats as StatsInterface[])[index].total
            }

            return parseFloat(((value / total) * 100).toFixed(0))
        },
        [index, isSearchResult, search.results, stats],
    )

    const getData = useCallback((): number[] => {
        let source: StatsInterface
        if (isSearchResult && search.results) {
            source = search.results
        } else {
            source = (stats as StatsInterface[])[index]
        }

        return [
            source.correct,
            source.wrong,
            source.started,
            source.total - source.started,
        ]
    }, [index, isSearchResult, search.results, stats])

    return (
        <>
            <Stat
                hoverText={getTouched()}
                text={getRel(getTouched())}
                label={Labels.touched}
            />
            <Stat
                hoverText={getUntouched()}
                text={getRel(getUntouched())}
                label={Labels.untouched}
            />
            <Stat
                hoverText={getCorrect()}
                text={getRel(getCorrect())}
                label={Labels.correct}
            />
            <Stat
                hoverText={getWrong()}
                text={getRel(getWrong())}
                label={Labels.wrong}
            />
            <div style={{ padding: "30px", height: "300px", width: "300px" }}>
                <StatDiagram data={getData()} />
            </div>
        </>
    )
}

export default Stats
