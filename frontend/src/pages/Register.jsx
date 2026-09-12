import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../components/css/Register.css";

const Register = () => {
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    // REGISTER
    // ==========================================

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!validateEmail(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        const passwordError = validatePassword(password);

        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            setLoading(true);

            console.log("");
            console.log("================================");
            console.log("USER REGISTER");
            console.log("================================");
            console.log("NAME:", name.trim());
            console.log("EMAIL:", email.trim());
            console.log("BACKEND URL:", backendUrl);

            const response = await axios.post(
                `${backendUrl}/api/user/register`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("REGISTER RESPONSE:", response.data);

            if (!response.data.success) {
                setError(
                    response.data.message ||
                    "Registration failed."
                );
                return;
            }

            if (response.data.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );
            }

            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            console.error("REGISTER ERROR:", err);

            if (err.response) {
                setError(
                    err.response.data?.message ||
                    "Registration failed."
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

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
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

    const passwordStrength = getPasswordStrength();

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-top-line"></div>

                <div className="register-header">

                    <span className="register-eyebrow">
                        CREATE ACCOUNT
                    </span>

                    <h1>
                        Sign Up
                    </h1>

                    <p>
                        Enter your details to create your account.
                    </p>

                </div>

                {error && (
                    <div className="register-message register-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="register-message register-success">
                        {success}
                    </div>
                )}

                <form
                    className="register-form"
                    onSubmit={handleRegister}
                >

                    {/* NAME */}

                    <div className="register-field">

                        <label htmlFor="name">
                            FULL NAME
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter your name"
                            autoComplete="name"
                        />

                    </div>

                    {/* EMAIL */}

                    <div className="register-field">

                        <label htmlFor="email">
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="register-field">

                        <div className="register-password-label">

                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <span>
                                MIN. 8 CHARACTERS
                            </span>

                        </div>

                        <div className="register-password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Create your password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="register-show-password"
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
                                            password.length >= 8
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                    <span
                                        className={
                                            /[A-Z]/.test(password)
                                                ? passwordStrength.className
                                                : ""
                                        }
                                    ></span>

                                    <span
                                        className={
                                            /[0-9]/.test(password)
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

                        {/* PASSWORD RULES */}

                        <div className="password-rules">

                            <p>
                                Your password should contain:
                            </p>

                            <div
                                className={
                                    password.length >= 8
                                        ? "rule valid"
                                        : "rule"
                                }
                            >
                                <span>•</span>
                                At least 8 characters
                            </div>

                            <div
                                className={
                                    /[A-Z]/.test(password)
                                        ? "rule valid"
                                        : "rule"
                                }
                            >
                                <span>•</span>
                                One uppercase letter
                            </div>

                            <div
                                className={
                                    /[a-z]/.test(password)
                                        ? "rule valid"
                                        : "rule"
                                }
                            >
                                <span>•</span>
                                One lowercase letter
                            </div>

                            <div
                                className={
                                    /[0-9]/.test(password)
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

                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="register-submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "CREATING ACCOUNT..."
                            : "CREATE ACCOUNT"}
                    </button>

                </form>

                {/* LOGIN */}

                <div className="register-login">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>

                <div className="register-footer">

                    <span>
                        SECURE ACCOUNT CREATION
                    </span>

                </div>

            </div>

        </div>
    );
};

export default Register;