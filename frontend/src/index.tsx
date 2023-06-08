// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import ReactDOM from "react-dom/client"
import App from "./components/layout/App"
import "bootstrap/dist/css/bootstrap.css"
import { HashRouter } from "react-router-dom"
import axios from "axios"
import React from "react"

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"
axios.interceptors.request.use(
    (request) => {
        request.headers["Accept-Language"] = localStorage.getItem("language")
        return request
    },
    (error) => {
        return Promise.reject(error)
    },
)

const prod = process.env.prod

const IndexPage = () => {
    return prod ? (
        <HashRouter>
            <App />
        </HashRouter>
    ) : (
        <React.StrictMode>
            <HashRouter>
                <App />
            </HashRouter>
        </React.StrictMode>
    )
}
const app = document.getElementById("app")
if (app) {
    ReactDOM.createRoot(app).render(<IndexPage />)
}
