// SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useState } from "react"
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap"
import config from "../../../../config.json"
import LanguageSelector from "../language/LanguageSelector"
import { useHistory } from "react-router"
import ThemeSelector from "../theme/ThemeSelector"
import "bootstrap-icons/font/bootstrap-icons.css"
import Feedback from "../feedback/Feedback"
import { makeStyles } from "tss-react/mui"
import Marked from "../marked/Marked"
import If from "../conditional/If"
import { useSelector } from "react-redux"
import { RootState } from "../../store/reducers/Store"
import HelpDrawer from "../../components/helpdrawer/HelpDrawer"

const useStyles = makeStyles()(() => ({
    navBar: {
        backgroundColor: config.THEME_COLORS.PRIMARY,
        color: config.THEME_COLORS.NEUTRAL,
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
    },
    navBarBrand: {
        color: config.THEME_COLORS.NEUTRAL,
        display: "flex",
    },
    brandSpan: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: "4px",
        "& i": {
            cursor: "pointer",
            fontSize: "22px",
            color: config.THEME_COLORS.NEUTRAL,
            "&:hover": {
                color: "black",
            },
        },
    },
    nav: {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        "& i": {
            cursor: "pointer",
            paddingLeft: "10px",
            paddingRight: "0px",
            fontSize: "22px",
            color: config.THEME_COLORS.NEUTRAL,
            "&:hover": {
                color: "black",
            },
        },
    },
}))

interface Props {
    animateHandler?: () => void
}

/**
 * NavBar component displays the navigation bar at the top of the layout.
 *
 * @component
 * @param {Props} props - Component properties.
 * @param {Function} props.animateHandler - Function to handle animation.
 * @param {Userdata} props.user - The user data.
 * @returns {JSX.Element} NavBar component.
 */
const NavBar: React.FC<Props> = (props) => {
    const { classes, cx } = useStyles()
    const history = useHistory()

    const { animateHandler } = props

    const user = useSelector((state: RootState) => state.user)

    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false)
    const [isMarkedOpen, setIsMarkedOpen] = useState<boolean>(false)
    const [isHelpBarOpen, setIsHelpBarOpen] = useState<boolean>(false)

    /**
     * handleIconClick function handles the click event for the icons. It triggers the animation handler and navigates to the requested page.
     *
     * @param {string} path - the requested path
     * @returns {void} The function does not return a value.
     */
    const handleIconClick = useCallback(
        (path: string) => {
            if (animateHandler !== undefined && window.location.hash !== path) {
                animateHandler()
                setTimeout(() => {
                    history.push(path)
                }, 200)
            }
        },
        [animateHandler, history],
    )

    return (
        <>
            <Navbar className={classes.navBar}>
                <NavbarBrand className={classes.navBarBrand}>
                    <span
                        onClick={() => handleIconClick("/")}
                        className={classes.brandSpan}
                    >
                        <i
                            role="button"
                            aria-label="Home Page"
                            className={cx("bi bi-house-door-fill")}
                        />
                        SQL-Train
                    </span>
                </NavbarBrand>
                <Nav className={classes.nav}>
                    <NavItem>{user.userdata?.username}</NavItem>
                    <If condition={user.userdata?.lecturer ?? false}>
                        <NavItem>
                            <i
                                role="button"
                                aria-label="Professor Page"
                                className={cx("bi bi-mortarboard-fill")}
                                onClick={() => handleIconClick("/prof")}
                            />
                        </NavItem>
                    </If>

                    <ThemeSelector />
                    <LanguageSelector />
                    <NavItem>
                        <i
                            aria-label="Open MarkedList Drawer"
                            role="button"
                            className={cx("bi bi-star-fill")}
                            onClick={() => setIsMarkedOpen(!isMarkedOpen)}
                        />
                    </NavItem>
                    <If condition={config.FEEDBACK.SHOW}>
                        <NavItem>
                            <i
                                aria-label="Open Feedback Drawer"
                                role="button"
                                className={cx("bi bi-hand-thumbs-up-fill")}
                                onClick={() =>
                                    setIsFeedbackOpen(!isFeedbackOpen)
                                }
                            />
                        </NavItem>
                        <Feedback
                            isOpen={isFeedbackOpen}
                            setIsOpen={setIsFeedbackOpen}
                        />
                    </If>
                    <Marked isOpen={isMarkedOpen} setIsOpen={setIsMarkedOpen} />
                    <HelpDrawer
                        isOpen={isHelpBarOpen}
                        setIsOpen={setIsHelpBarOpen}
                    />
                    <i
                        className={cx("bi bi-question-lg")}
                        onClick={() => setIsHelpBarOpen(!isHelpBarOpen)}
                    />
                </Nav>
            </Navbar>
        </>
    )
}

export default NavBar
