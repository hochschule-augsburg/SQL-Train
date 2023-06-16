// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react"
import { Route, Switch } from "react-router-dom"
import TopicsPage from "../../pages/TopicsPage"
import ExercisesPage from "../../pages/ExercisesPage"
import ExercisePage from "../../pages/ExercisePage"
import ExerciseTour from "../exercise/ExerciseTour"
// import StatsPage from "../../pages/StatsPage"

const StatsPage = React.lazy(() => import("../../pages/StatsPage"))

/**
 * Router component defines the routing configuration for the application.
 *
 * @component
 * @returns {JSX.Element} Router component.
 */
const Router: React.FC = () => {
    return (
        <ExerciseTour>
            <Switch>
                <Route exact path="/" component={TopicsPage} />
                <Route
                    path="/topic/:topicId/exercise/:exerciseId"
                    component={ExercisePage}
                />
                <Route exact path="/topic/:topicId" component={ExercisesPage} />
                <React.Suspense>
                    <Route exact path="/prof/" component={StatsPage} />
                </React.Suspense>
            </Switch>{" "}
        </ExerciseTour>
    )
}

export default Router
