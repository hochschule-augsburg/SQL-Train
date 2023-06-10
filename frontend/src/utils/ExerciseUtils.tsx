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

export type ExerciseURLParams = {
    topicId: string
    exerciseId: string
}

/**
 * Validates the exercise parameters extracted from the URL.
 * @param params - The exercise URL parameters.
 * @returns An object containing the validated topicId and exerciseId.
 */
export const validateExerciseFromURL = (params: ExerciseURLParams) => {
    return {
        topicId: validateTopicFromURL(params.topicId),
        exerciseId: validateENumberFromURL(params.exerciseId),
    }
}

/**
 * Validates the topic parameter extracted from the URL.
 * @param topic - The topic extracted from the URL.
 * @returns The validated topic or "none" if it is invalid.
 */
export const validateTopicFromURL = (topic: string) => {
    const slugRegex = /^[a-zA-Z0-9_-]+$/
    if (topic.length > 20 || !slugRegex.test(topic)) {
        return "none"
    }
    return topic
}

/**
 * Validates the exercise number parameter extracted from the URL.
 * @param enumber - The exercise number extracted from the URL.
 * @returns The validated exercise number as a parsed integer or 1 if it is invalid.
 */
export const validateENumberFromURL = (enumber: string) => {
    const numberRegex = /^\d+$/
    if (!numberRegex.test(enumber)) {
        return 1
    }
    return parseInt(enumber)
}
