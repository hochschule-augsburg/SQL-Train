// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

export enum OperatingSystem {
    MAC,
    OTHER,
}

/**
 * getOperatingSystem function determines the user's operating system.
 *
 * @returns {OperatingSystem} The user's operating system.
 */
export const getOperatingSystem = (): OperatingSystem => {
    if (window.navigator.userAgent.indexOf("Mac") !== -1) {
        return OperatingSystem.MAC
    }
    return OperatingSystem.OTHER
}
