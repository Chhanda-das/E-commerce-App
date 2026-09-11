import React, {
    useContext,
    useState
} from "react";

import axios from "axios";

import {
    Link,
    NavLink
} from "react-router-dom";

import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

import "./css/Navbar.css";


const Navbar = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [visible, setVisible] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);

    const [searchValue, setSearchValue] = useState("");


    // ==========================================
    // SHOP CONTEXT
    // ==========================================

    const {
        setShowSearch,
        setSearch,
        getCartCount,
        navigate,
        backendUrl,
        setCartItems
    } = useContext(ShopContext);


    // ==========================================
    // NAV LINK STYLE
    // ==========================================

    const navLinkStyle = ({ isActive }) =>
        `navbar-link ${
            isActive
                ? "navbar-link-active"
                : ""
        }`;


    // ==========================================
    // OPEN SEARCH
    // ==========================================

    const openSearch = () => {

        setProfileOpen(false);

        setVisible(false);

        setSearchOpen(true);

        if (setShowSearch) {
            setShowSearch(true);
        }

    };


    // ==========================================
    // CLOSE SEARCH
    // ==========================================

    const closeSearch = () => {

        setSearchOpen(false);

        setSearchValue("");

        if (setSearch) {
            setSearch("");
        }

        if (setShowSearch) {
            setShowSearch(false);
        }

    };


    // ==========================================
    // SEARCH HANDLER
    // ==========================================

    const handleSearch = (event) => {

        const value = event.target.value;

        setSearchValue(value);

        if (setSearch) {
            setSearch(value);
        }

    };


    // ==========================================
    // SUBMIT SEARCH
    // ==========================================

    const submitSearch = (event) => {

        event.preventDefault();

        const value = searchValue.trim();

        if (!value) {

            navigate("/collection");

            return;

        }

        if (setSearch) {
            setSearch(value);
        }

        setSearchOpen(false);

        if (setShowSearch) {
            setShowSearch(false);
        }

        navigate("/collection");

    };


    // ==========================================
    // PROFILE MENU TOGGLE
    // ==========================================

    const toggleProfile = () => {

        setProfileOpen(
            (prev) => !prev
        );

    };


    // ==========================================
    // CLOSE PROFILE MENU
    // ==========================================

    const closeProfileMenu = () => {

        setProfileOpen(false);

    };


    // ==========================================
    // GO TO PROFILE
    // ==========================================

    const goToProfile = () => {

        closeProfileMenu();

        navigate("/profile");

    };


    // ==========================================
    // GO TO ORDERS
    // ==========================================

    const goToOrders = () => {

        closeProfileMenu();

        navigate("/orders");

    };


    // ==========================================
    // GO TO LOGIN
    // ==========================================

    const goToLogin = () => {

        closeProfileMenu();

        navigate("/login");

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = async () => {

        try {

            await axios.post(
                `${backendUrl}/api/user/logout`,
                {},
                {
                    withCredentials: true
                }
            );

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

        } finally {

            if (setCartItems) {

                setCartItems({});

            }

            setProfileOpen(false);

            navigate("/login", {
                replace: true
            });

        }

    };


    // ==========================================
    // OPEN MOBILE MENU
    // ==========================================

    const openMobileMenu = () => {

        setProfileOpen(false);

        setVisible(true);

    };


    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {

        setVisible(false);

    };


    // ==========================================
    // RETURN
    // ==========================================

    return (
        <>

            {/* ======================================
                DESKTOP NAVBAR
            ====================================== */}

            <header className="navbar">

                <div className="navbar-inner">


                    {/* ==================================
                        LOGO
                    ================================== */}

                    <Link
                        to="/"
                        className="navbar-logo-link"
                    >

                        <img
                            src={assets.logo}
                            className="navbar-logo"
                            alt="Forever"
                        />

                    </Link>


                    {/* ==================================
                        DESKTOP MENU
                    ================================== */}

                    <nav className="navbar-menu">


                        {/* HOME */}

                        <NavLink
                            to="/"
                            className={navLinkStyle}
                        >

                            <span>
                                HOME
                            </span>

                            <i></i>

                        </NavLink>


                        {/* COLLECTION */}

                        <NavLink
                            to="/collection"
                            className={navLinkStyle}
                        >

                            <span>
                                COLLECTION
                            </span>

                            <i></i>

                        </NavLink>


                        {/* ABOUT */}

                        <NavLink
                            to="/about"
                            className={navLinkStyle}
                        >

                            <span>
                                ABOUT
                            </span>

                            <i></i>

                        </NavLink>


                        {/* CONTACT */}

                        <NavLink
                            to="/contact"
                            className={navLinkStyle}
                        >

                            <span>
                                CONTACT
                            </span>

                            <i></i>

                        </NavLink>

                    </nav>


                    {/* ==================================
                        RIGHT ACTIONS
                    ================================== */}

                    <div className="navbar-actions">


                        {/* ==================================
                            SEARCH
                        ================================== */}

                        <button
                            type="button"
                            className="navbar-icon-button"
                            onClick={openSearch}
                            aria-label="Search"
                        >

                            <img
                                src={assets.search_icon}
                                alt="Search"
                            />

                        </button>


                        {/* ==================================
                            PROFILE DROPDOWN
                        ================================== */}

                        <div className="navbar-profile relative">


                            {/* PROFILE ICON */}

                            <button
                                type="button"
                                className="navbar-icon-button"
                                onClick={toggleProfile}
                                aria-label="Profile menu"
                                aria-expanded={profileOpen}
                            >

                                <img
                                    src={assets.profile_icon}
                                    alt="Profile"
                                />

                            </button>


                            {/* PROFILE DROPDOWN */}

                            {profileOpen && (

                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-full
                                        mt-3
                                        w-52
                                        bg-white
                                        border
                                        border-gray-200
                                        shadow-lg
                                        z-50
                                    "
                                >


                                    {/* PROFILE */}

                                    <button
                                        type="button"
                                        onClick={goToProfile}
                                        className="
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-sm
                                            text-gray-800
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        <span className="mr-2">
                                            👤
                                        </span>

                                        Profile

                                    </button>


                                    {/* ORDERS */}

                                    <button
                                        type="button"
                                        onClick={goToOrders}
                                        className="
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-sm
                                            text-gray-800
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        <span className="mr-2">
                                            📦
                                        </span>

                                        My Orders

                                    </button>


                                    <div className="border-t border-gray-100"></div>


                                    {/* SIGN IN */}

                                    <button
                                        type="button"
                                        onClick={goToLogin}
                                        className="
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-sm
                                            text-gray-800
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        <span className="mr-2">
                                            🔐
                                        </span>

                                        Sign In

                                    </button>


                                    {/* LOGOUT */}

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="
                                            w-full
                                            text-left
                                            px-5
                                            py-3
                                            text-sm
                                            text-red-600
                                            hover:bg-red-50
                                            transition
                                        "
                                    >

                                        <span className="mr-2">
                                            🚪
                                        </span>

                                        Logout

                                    </button>


                                </div>

                            )}

                        </div>


                        {/* ==================================
                            CART
                        ================================== */}

                        <Link
                            to="/cart"
                            className="navbar-cart"
                        >

                            <img
                                src={assets.cart_icon}
                                alt="Cart"
                            />

                            <span>
                                {getCartCount()}
                            </span>

                        </Link>


                        {/* ==================================
                            MOBILE BUTTON
                        ================================== */}

                        <button
                            type="button"
                            className="navbar-mobile-button"
                            onClick={openMobileMenu}
                            aria-label="Open menu"
                        >

                            <span></span>
                            <span></span>
                            <span></span>

                        </button>


                    </div>

                </div>

            </header>


            {/* ======================================
                SEARCH OVERLAY
            ====================================== */}

            {searchOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black/40
                        z-[100]
                        flex
                        items-start
                        justify-center
                        pt-24
                        px-4
                    "
                    onClick={closeSearch}
                >

                    <form
                        onSubmit={submitSearch}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="
                            bg-white
                            w-full
                            max-w-2xl
                            shadow-2xl
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                border-b
                                border-gray-300
                                pb-3
                            "
                        >

                            {/* SEARCH ICON */}

                            <img
                                src={assets.search_icon}
                                alt="Search"
                                className="w-5 h-5"
                            />


                            {/* INPUT */}

                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearch}
                                autoFocus
                                placeholder="Search products..."
                                className="
                                    flex-1
                                    outline-none
                                    text-base
                                    bg-transparent
                                "
                            />


                            {/* CLOSE */}

                            <button
                                type="button"
                                onClick={closeSearch}
                                className="
                                    text-2xl
                                    text-gray-500
                                    hover:text-black
                                "
                                aria-label="Close search"
                            >
                                ×
                            </button>

                        </div>


                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="
                                mt-4
                                w-full
                                bg-black
                                text-white
                                py-3
                                text-sm
                                tracking-wide
                                hover:bg-gray-800
                                transition
                            "
                        >
                            SEARCH PRODUCTS
                        </button>

                    </form>

                </div>

            )}


            {/* ======================================
                MOBILE SIDEBAR
            ====================================== */}

            {visible && (

                <div className="mobile-sidebar-overlay">


                    {/* BACKDROP */}

                    <div
                        className="mobile-sidebar-backdrop"
                        onClick={closeMobileMenu}
                    ></div>


                    {/* SIDEBAR */}

                    <aside className="mobile-sidebar">


                        {/* HEADER */}

                        <div className="mobile-sidebar-header">

                            <span>
                                FOREVER
                            </span>

                            <button
                                type="button"
                                onClick={closeMobileMenu}
                                aria-label="Close menu"
                            >
                                ×
                            </button>

                        </div>


                        {/* MENU */}

                        <div className="mobile-sidebar-menu">


                            {/* HOME */}

                            <NavLink
                                to="/"
                                onClick={closeMobileMenu}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    01
                                </span>

                                <span>
                                    HOME
                                </span>

                                <b>
                                    →
                                </b>

                            </NavLink>


                            {/* COLLECTION */}

                            <NavLink
                                to="/collection"
                                onClick={closeMobileMenu}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    02
                                </span>

                                <span>
                                    COLLECTION
                                </span>

                                <b>
                                    →
                                </b>

                            </NavLink>


                            {/* ABOUT */}

                            <NavLink
                                to="/about"
                                onClick={closeMobileMenu}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    03
                                </span>

                                <span>
                                    ABOUT
                                </span>

                                <b>
                                    →
                                </b>

                            </NavLink>


                            {/* CONTACT */}

                            <NavLink
                                to="/contact"
                                onClick={closeMobileMenu}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    04
                                </span>

                                <span>
                                    CONTACT
                                </span>

                                <b>
                                    →
                                </b>

                            </NavLink>


                            {/* FOOTWEAR */}

                            <NavLink
                                to="/footwear"
                                onClick={closeMobileMenu}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    05
                                </span>

                                <span>
                                    FOOTWEAR
                                </span>

                                <b>
                                    →
                                </b>

                            </NavLink>


                            {/* PROFILE */}

                            <button
                                type="button"
                                onClick={() => {

                                    closeMobileMenu();

                                    navigate("/profile");

                                }}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    06
                                </span>

                                <span>
                                    PROFILE
                                </span>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* ORDERS */}

                            <button
                                type="button"
                                onClick={() => {

                                    closeMobileMenu();

                                    navigate("/orders");

                                }}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    07
                                </span>

                                <span>
                                    MY ORDERS
                                </span>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* SIGN IN */}

                            <button
                                type="button"
                                onClick={() => {

                                    closeMobileMenu();

                                    navigate("/login");

                                }}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    08
                                </span>

                                <span>
                                    SIGN IN
                                </span>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={() => {

                                    closeMobileMenu();

                                    logout();

                                }}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    09
                                </span>

                                <span>
                                    LOGOUT
                                </span>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* MOBILE SEARCH */}

                            <button
                                type="button"
                                onClick={openSearch}
                                className="mobile-nav-link"
                            >

                                <span className="mobile-nav-number">
                                    10
                                </span>

                                <span>
                                    SEARCH
                                </span>

                                <b>
                                    →
                                </b>

                            </button>


                        </div>


                        {/* FOOTER */}

                        <div className="mobile-sidebar-footer">

                            <span>
                                STYLE • QUALITY • FOREVER
                            </span>

                        </div>


                    </aside>

                </div>

            )}

        </>
    );

};


export default Navbar;