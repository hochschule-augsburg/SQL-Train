// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import Topic from "../components/topic/Topic"
import { useHistory } from "react-router-dom"
import { TopicOverview as ApiTopicOverview } from "../api"
import logo from "../assets/logo-1000x1000.png"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../store/reducers/Store"
import If from "../components/conditional/If"
import { makeStyles } from "tss-react/mui"
import AnimatedDiv from "../components/animation/AnimatedDiv"
import { fetchTopicOverviews, fetchTopics } from "../store/reducers/topic"
import SearchBar from "../components/searchbar/SearchBar"
import { fetchFilterOpts, selectOpt } from "../store/reducers/filter"
import { fetchResults } from "../store/reducers/search"
import Results from "../components/results/Results"
import { useTranslation } from "react-i18next"
import { ErrorContext } from "../components/layout/ErrorContext"

const useStyles = makeStyles()(() => ({
    logo: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "2%",
        paddingBottom: "2%",
    },
    topicsWrapper: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "2%",
    },
    topicDiv: {
        textDecoration: "none",
    },
    searchBarWrapper: {
        display: "flex",
        justifyContent: "center",
    },
}))

interface TopicOverview extends ApiTopicOverview {
    title: string
    tag?: string
}

/**
 * TopicPage component represents the topic page.
 *
 * @component
 * @returns {JSX.Element} TopicPage component.
 */
const TopicPage: React.FC = () => {
    const history = useHistory()

    const { t } = useTranslation("common")
    const dispatch = useAppDispatch()
    const { classes } = useStyles()
    const { setError } = useContext(ErrorContext)

    const topic = useSelector((state: RootState) => state.topic)
    const filter = useSelector((state: RootState) => state.filter)
    const search = useSelector((state: RootState) => state.search)

    const [transSwitch, setTransSwitch] = useState<boolean>(true)
    const [showResult, setShowResult] = useState<boolean>(false)

    const showResultHandler = useCallback((to: boolean) => {
        setShowResult(to)
    }, [])

    /**
     * topicClickHandler function handles the logic when a topic is clicked.
     *
     * @param {string} topicId - The ID of the topic.
     * @returns {void} The function does not return a value.
     */
    const topicClickHandler = useCallback(
        (topicId: string) => {
            setTransSwitch((t) => !t)
            setTimeout(() => {
                history.push("topic/" + topicId)
            }, 200)
        },
        [history],
    )

    useEffect(() => {
        if (!showResult) {
            dispatch(fetchTopics()).catch(() =>
                setError(t("general.error.topic")),
            )
            dispatch(fetchTopicOverviews()).catch(() =>
                setError(t("general.error.topic")),
            )

            dispatch(fetchFilterOpts()).catch(() =>
                setError(t("general.error.unknown")),
            )
        }
    }, [dispatch, setError, showResult, t])

    useEffect(() => {
        dispatch(fetchResults(filter.selOpts))
    }, [dispatch, filter.selOpts])

    const userTopics = useMemo(() => {
        const currentUserTopics: TopicOverview[] = []
        topic.topicOverviews.map((topicOverview) => {
            const topicData = topic.topics.find(
                (topic) => topic.short == topicOverview.topic,
            )
            if (topicData) {
                currentUserTopics.unshift({
                    topic: topicOverview.topic,
                    count_exercises: topicOverview.count_exercises,
                    count_correct: topicOverview.count_correct,
                    title: topicData.title,
                    tag: topicData.tag,
                })
            }
        })

        return currentUserTopics
    }, [topic.topicOverviews, topic.topics])

    return (
        <>
            <AnimatedDiv transSwitch={transSwitch}>
                <div>
                    <div className={classes.logo}>
                        <img width={200} height={200} src={logo} alt="Logo" />
                    </div>

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
                        {search.results.map((t) => (
                            <Results topic={t} key={t.topic_title} />
                        ))}
                    </If>

                    <If condition={!showResult}>
                        <div className={classes.topicsWrapper}>
                            {userTopics.map((userTopic) => (
                                <div
                                    key={userTopic.topic}
                                    className={classes.topicDiv}
                                    onClick={() =>
                                        topicClickHandler(userTopic.topic)
                                    }
                                >
                                    <Topic
                                        topicId={userTopic.topic}
                                        topicTitle={userTopic.title}
                                        tag={userTopic.tag}
                                        count={userTopic.count_exercises}
                                        count_correct={userTopic.count_correct}
                                    />
                                </div>
                            ))}
                        </div>
                    </If>
                </div>
            </AnimatedDiv>
        </>
    )
}

export default TopicPage
