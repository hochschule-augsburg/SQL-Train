// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useContext, useEffect, useState } from "react"
import Title from "../components/exercise/Title"
import { makeStyles } from "tss-react/mui"
import { Stats as StatsInterface, DefaultApi, Userdata } from "../api"
import { apiExec, hasFailed } from "../utils/ApiUtils"
import { useTranslation } from "react-i18next"
import If from "../components/conditional/If"
import SearchBar from "../components/searchbar/SearchBar"
import { fetchFilterOpts, selectOpt } from "../store/reducers/profFilter"
import { RootState, useAppDispatch } from "../store/reducers/Store"
import { useSelector } from "react-redux"
import { fetchProfResults } from "../store/reducers/profSearch"
import { fetchTopics } from "../store/reducers/topic"
import Stats from "../components/stats/Stats"
import { ErrorContext } from "../components/layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    divWrapper: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginInline: "10%",
    },
    buttonDiv: {
        textDecoration: "none",
    },
    searchBarWrapper: {
        display: "flex",
        justifyContent: "center",
        paddingBottom: "40px",
    },
    statsWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "50px",
    },
}))

export const Labels = {
    correct: { color: "green", text: "stats.correct" },
    wrong: { color: "red", text: "stats.wrong" },
    touched: { color: "orange", text: "stats.touched" },
    untouched: { color: "#333333", text: "stats.untouched" },
}

const StatsPage: React.FC = () => {
    const { t } = useTranslation("common")
    const { setError } = useContext(ErrorContext)

    const dispatch = useAppDispatch()

    const { classes } = useStyles()

    const filter = useSelector((state: RootState) => state.profFilter)
    const search = useSelector((state: RootState) => state.profSearch)
    const topics = useSelector((state: RootState) => state.topic)

    const [user, setUser] = useState<Userdata | undefined>(undefined)
    const [userNum, setUserNum] = useState<number | undefined>(undefined)
    const [stats, setStats] = useState<StatsInterface[] | undefined>(undefined)
    const [showResult, setShowResult] = useState<boolean>(false)

    const showResultHandler = useCallback((to: boolean) => {
        setShowResult(to)
    }, [])

    const fetchStats = useCallback(async () => {
        const responseUser = await apiExec(DefaultApi, (api) =>
            api.exercisesApiGetUserdata(),
        )
        const responseUserNum = await apiExec(DefaultApi, (api) =>
            api.exercisesStatsApiCourseInfo(),
        )

        if (hasFailed(responseUser || responseUserNum)) {
            setError(t("general.error.unknown"))
        } else {
            setUser(responseUser.data)
            setUserNum(responseUserNum.data?.user_num)
        }
        const topicsStats: StatsInterface[] = []
        for (let i = 0; i < topics.topics.length; i++) {
            const responseStats = await apiExec(DefaultApi, (api) =>
                api.exercisesStatsApiExercises([
                    topics.topics[i].short as string,
                ]),
            )
            if (!hasFailed(responseStats)) {
                topicsStats.push(responseStats.data)
            }
        }
        setStats(topicsStats)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setError, t, topics.topics.length])

    useEffect(() => {
        fetchStats()
        dispatch(fetchTopics())
        showResult ? "" : dispatch(fetchFilterOpts())
    }, [dispatch, showResult, fetchStats])

    useEffect(() => {
        dispatch(fetchProfResults(filter.selOpts)).catch(() =>
            setError(t("general.error.search")),
        )
    }, [dispatch, filter.selOpts, setError, t])

    return (
        <>
            <Title
                text={`${user?.course_title ?? t("stats.nocourse")}, ${t(
                    "stats.student",
                    { count: userNum },
                )}`}
            />
            <div className={classes.searchBarWrapper}>
                <SearchBar
                    showResultHandler={showResultHandler}
                    showResult={showResult}
                    opts={filter.opts}
                    selOpts={filter.selOpts}
                    selectHandler={selectOpt}
                />
            </div>

            <If condition={filter.selOpts.length > 0}>
                {search && search.results && (
                    <div className={classes.statsWrapper}>
                        <Stats isSearchResult={true} index={0} />
                    </div>
                )}
            </If>

            <If condition={filter.selOpts.length <= 0 && stats !== undefined}>
                {stats?.map((topic, i) => (
                    <>
                        <Title text={topics.topics[i].title} />
                        <div key={i} className={classes.statsWrapper}>
                            <Stats
                                isSearchResult={false}
                                index={i}
                                stats={stats}
                            />
                        </div>
                    </>
                ))}
            </If>
        </>
    )
}

export default StatsPage
