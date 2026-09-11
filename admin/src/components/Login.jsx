import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const Login = () => {
    const { login } = useContext(AdminContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // LOGIN
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Please enter your admin email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            console.log("================================");
            console.log("ADMIN LOGIN START");
            console.log("EMAIL:", cleanEmail);
            console.log("================================");

            const success = await login(
                cleanEmail,
                password
            );

            console.log(
                "ADMIN LOGIN RESULT:",
                success
            );

            if (success) {
                console.log(
                    "ADMIN LOGIN SUCCESS - OPENING PANEL"
                );

                navigate("/", {
                    replace: true,
                });

                return;
            }

            setError(
                "Admin login failed. Please check your credentials."
            );

        } catch (error) {
            console.error(
                "LOGIN PAGE ERROR:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-[#f5f6f8] flex">

            {/* ==========================================
                LEFT SIDE
            ========================================== */}

            <div className="hidden lg:flex lg:w-1/2 bg-[#111827] text-white relative overflow-hidden">

                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />

                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5" />

                <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">

                    {/* BRAND */}

                    <div>
                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
                                F
                            </div>

                            <div>
                                <h1 className="text-xl font-semibold tracking-wide">
                                    FOREVER
                                </h1>

                                <p className="text-xs text-gray-400 tracking-[0.25em]">
                                    ADMIN
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* CENTER */}

                    <div className="max-w-lg">

                        <p className="text-sm text-gray-400 uppercase tracking-[0.3em] mb-5">
                            Store Management
                        </p>

                        <h2 className="text-5xl xl:text-6xl font-semibold leading-tight">
                            Manage your
                            <br />
                            store with ease.
                        </h2>

                        <p className="mt-6 text-gray-400 text-base leading-7 max-w-md">
                            Manage products, orders and your
                            complete Forever store from one
                            secure administration panel.
                        </p>

                    </div>

                    {/* FOOTER */}

                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Forever Store
                    </div>

                </div>
            </div>

            {/* ==========================================
                RIGHT SIDE
            ========================================== */}

            <div className="flex-1 flex items-center justify-center px-5 py-10">

                <div className="w-full max-w-md">

                    {/* MOBILE BRAND */}

                    <div className="lg:hidden text-center mb-8">

                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white font-bold text-lg mb-3">
                            F
                        </div>

                        <h1 className="text-xl font-semibold tracking-wide">
                            FOREVER
                        </h1>

                        <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-1">
                            ADMIN PORTAL
                        </p>

                    </div>

                    {/* CARD */}

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-7 sm:p-9">

                        {/* HEADER */}

                        <div className="mb-8">

                            <p className="text-xs font-medium text-gray-400 uppercase tracking-[0.25em]">
                                Admin Portal
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                                Welcome back
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Sign in to continue to your admin panel.
                            </p>

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                                <p className="text-sm text-red-600">
                                    {error}
                                </p>

                            </div>
                        )}

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* EMAIL */}

                            <div>

                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="admin@gmail.com"
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                    className="
                                        w-full
                                        h-12
                                        px-4
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        text-gray-900
                                        placeholder-gray-400
                                        outline-none
                                        transition
                                        focus:border-gray-900
                                        focus:ring-2
                                        focus:ring-gray-900/10
                                        disabled:bg-gray-100
                                        disabled:cursor-not-allowed
                                    "
                                />

                            </div>

                            {/* PASSWORD */}

                            <div>

                                <div className="flex items-center justify-between mb-2">

                                    <label className="block text-sm font-medium text-gray-800">
                                        Password
                                    </label>

                                </div>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        required
                                        className="
                                            w-full
                                            h-12
                                            px-4
                                            pr-16
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            text-gray-900
                                            placeholder-gray-400
                                            outline-none
                                            transition
                                            focus:border-gray-900
                                            focus:ring-2
                                            focus:ring-gray-900/10
                                            disabled:bg-gray-100
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (value) => !value
                                            )
                                        }
                                        disabled={loading}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-xs
                                            font-medium
                                            text-gray-500
                                            hover:text-gray-900
                                            disabled:opacity-50
                                        "
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>

                            {/* SIGN IN */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    w-full
                                    h-12
                                    rounded-xl
                                    bg-gray-900
                                    text-white
                                    font-medium
                                    transition
                                    hover:bg-black
                                    active:scale-[0.99]
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    flex
                                    items-center
                                    justify-center
                                    gap-3
                                "
                            >

                                {loading ? (
                                    <>
                                        <span
                                            className="
                                                w-4
                                                h-4
                                                border-2
                                                border-white/30
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}

                            </button>

                        </form>

                        {/* SECURITY */}

                        <div className="mt-7 pt-6 border-t border-gray-100">

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">

                                <span>🔒</span>

                                <span>
                                    Authorized administrators only
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;