// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Solution } from "../api"

/**
 * getSolutionContent function converts a response containing solutions to a formatted string.
 *
 * @param {Solution[]} response - The array of solutions.
 * @returns {string} The formatted string representation of the solutions.
 */
export const getSolutionContent = (response: Solution[]): string => {
    let results = ""
    response.forEach((e, i) => {
        results += `-- ${i + 1})\n`
        const desc_lines = e.description ? e.description?.split("\n") : []
        desc_lines.forEach((line) => {
            let out = ""
            const desc_words = line.split(" ")
            desc_words.forEach((e) => {
                if (out.length < 36) {
                    out += " " + e
                } else {
                    results += "-- " + out + "\n"
                    out = ""
                }
            })
            results += "-- " + out + "\n"
        })
        results += `\n${e.sql}\n\n`
    })
    return results
}
