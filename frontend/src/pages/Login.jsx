import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../components/css/Login.css";

const Login = () => {
    const navigate = useNavigate();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );
    };

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(password)) {
            return "Password must contain at least one special character.";
        }

        return "";
    };

    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ------------------------------------------
        // EMAIL REQUIRED
        // ------------------------------------------

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        // ------------------------------------------
        // EMAIL FORMAT
        // ------------------------------------------

        if (!validateEmail(email.trim())) {
            setError(
                "Please enter a valid email address."
            );
            return;
        }

        // ------------------------------------------
        // PASSWORD REQUIRED
        // ------------------------------------------

        if (!password) {
            setError(
                "Please enter your password."
            );
            return;
        }

        // ------------------------------------------
        // PASSWORD STRENGTH
        // ------------------------------------------

        const passwordError =
            validatePassword(password);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        // ------------------------------------------
        // API REQUEST
        // ------------------------------------------

        try {
            setLoading(true);

            console.log("");
            console.log(
                "================================"
            );
            console.log("USER LOGIN");
            console.log(
                "================================"
            );

            console.log(
                "EMAIL:",
                email.trim()
            );

            const response =
                await axios.post(
                    `${backendUrl}/api/user/login`,
                    {
                        email:
                            email.trim(),
                        password,
                    }
                );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            // ------------------------------------------
            // LOGIN FAILED
            // ------------------------------------------

            if (!response.data.success) {
                setError(
                    response.data.message ||
                        "Login failed."
                );

                return;
            }

            // ------------------------------------------
            // SAVE TOKEN
            // ------------------------------------------

            if (response.data.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );

                console.log(
                    "TOKEN SAVED TO LOCAL STORAGE"
                );
            }

            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            setSuccess(
                "Login successful."
            );

            // ------------------------------------------
            // GO HOME
            // ------------------------------------------

            setTimeout(() => {
                navigate("/");
            }, 700);

        } catch (err) {
            console.error(
                "LOGIN ERROR:",
                err
            );

            if (err.response) {
                setError(
                    err.response.data?.message ||
                        "Login failed."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // PASSWORD STRENGTH
    // ==========================================

    const getPasswordStrength = () => {
        if (!password) {
            return {
                text: "",
                className: "",
            };
        }

        let score = 0;

        if (password.length >= 8)
            score++;

        if (/[A-Z]/.test(password))
            score++;

        if (/[a-z]/.test(password))
            score++;

        if (/[0-9]/.test(password))
            score++;

        if (
            /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
                password
            )
        ) {
            score++;
        }

        if (score <= 2) {
            return {
                text: "Weak",
                className: "weak",
            };
        }

        if (score <= 4) {
            return {
                text: "Medium",
                className: "medium",
            };
        }

        return {
            text: "Strong",
            className: "strong",
        };
    };

    const passwordStrength =
        getPasswordStrength();

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="login-page">

            <div className="login-card">

                {/* ==================================
                    TOP GOLD LINE
                ================================== */}

                <div className="login-top-line"></div>

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="login-header">

                    <span className="login-eyebrow">
                        WELCOME BACK
                    </span>

                    <h1>
                        Sign In
                    </h1>

                    <p>
                        Enter your details to
                        continue.
                    </p>

                </div>

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                    <div className="login-message login-error">
                        {error}
                    </div>
                )}

                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (
                    <div className="login-message login-success">
                        {success}
                    </div>
                )}

                {/* ==================================
                    FORM
                ================================== */}

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    {/* EMAIL */}

                    <div className="login-field">

                        <label htmlFor="email">
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(
                                    e.target.value
                                );
                                setError("");
                            }}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="login-field">

                        <div className="login-password-label">

                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <span>
                                MIN. 8 CHARACTERS
                            </span>

                        </div>

                        <div className="login-password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) => {
                                    setPassword(
                                        e.target.value
                                    );
                                    setError("");
                                }}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="login-show-password"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "HIDE"
                                    : "SHOW"}
                            </button>

                        </div>

                        {/* PASSWORD STRENGTH */}

                        {password && (
                            <div className="password-strength">

                                <div className="strength-bars">

                                    <span
                                        className={
                                            passwordStrength.className
                                        }
                                    ></span>

                                    <span
                                        className={
                                            password.length >=
                                            8
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                    <span
                                        className={
                                            /[A-Z]/.test(
                                                password
                                            )
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                    <span
                                        className={
                                            /[0-9]/.test(
                                                password
                                            )
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                    <span
                                        className={
                                            /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
                                                password
                                            )
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                </div>

                                <span
                                    className={`strength-text ${passwordStrength.className}`}
                                >
                                    {passwordStrength.text}
                                </span>

                            </div>
                        )}

                    </div>

                    {/* PASSWORD RULES */}

                    <div className="password-rules">

                        <p>
                            Your password should
                            contain:
                        </p>

                        <div
                            className={
                                password.length >=
                                8
                                    ? "rule valid"
                                    : "rule"
                            }
                        >
                            <span>•</span>
                            At least 8 characters
                        </div>

                        <div
                            className={
                                /[A-Z]/.test(
                                    password
                                )
                                    ? "rule valid"
                                    : "rule"
                            }
                        >
                            <span>•</span>
                            One uppercase letter
                        </div>

                        <div
                            className={
                                /[a-z]/.test(
                                    password
                                )
                                    ? "rule valid"
                                    : "rule"
                            }
                        >
                            <span>•</span>
                            One lowercase letter
                        </div>

                        <div
                            className={
                                /[0-9]/.test(
                                    password
                                )
                                    ? "rule valid"
                                    : "rule"
                            }
                        >
                            <span>•</span>
                            One number
                        </div>

                        <div
                            className={
                                /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
                                    password
                                )
                                    ? "rule valid"
                                    : "rule"
                            }
                        >
                            <span>•</span>
                            One special character
                        </div>

                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "SIGNING IN..."
                            : "SIGN IN"}
                    </button>

                </form>

                {/* ==================================
                    REGISTER
                ================================== */}

                <div className="login-register">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

                {/* ==================================
                    FOOTER
                ================================== */}

                <div className="login-footer">

                    <span>
                        SECURE ACCOUNT ACCESS
                    </span>

                </div>

            </div>

        </div>
    );
};

export default Login;