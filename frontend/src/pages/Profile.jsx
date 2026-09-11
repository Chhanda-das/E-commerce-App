import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../components/css/Profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    // ==========================================
    // USER
    // ==========================================

    const [user, setUser] = useState(null);

    // ==========================================
    // LOADING / ERROR
    // ==========================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // EDIT MODE
    // ==========================================

    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    // ==========================================
    // PASSWORD
    // ==========================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [changingPassword, setChangingPassword] =
        useState(false);

    const [passwordMessage, setPasswordMessage] =
        useState("");

    // ==========================================
    // GET TOKEN
    // ==========================================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ==========================================
    // GET PROFILE
    // ==========================================

    const getProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            console.log("================================");
            console.log("PROFILE REQUEST");
            console.log(
                "TOKEN:",
                token ? "FOUND" : "NOT FOUND"
            );
            console.log("BACKEND:", backendUrl);
            console.log("================================");

            if (!token) {
                setError(
                    "Please login to view your profile."
                );
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${backendUrl}/api/user/profile`,
                {
                    headers: {
                        token,
                    },
                }
            );

            console.log(
                "PROFILE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                const userData = response.data.user;

                setUser(userData);

                setFormData({
                    name: userData.name || "",
                    phone: userData.phone || "",
                    address: userData.address || "",
                });
            } else {
                setError(
                    response.data.message ||
                        "Unable to load profile."
                );
            }
        } catch (err) {
            console.error(
                "PROFILE ERROR:",
                err
            );

            if (
                err.response?.status === 401
            ) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.message ||
                    "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        getProfile();
    }, []);

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    // ==========================================
    // EDIT PROFILE
    // ==========================================

    const handleEdit = () => {
        setEditMode(true);
        setSuccess("");
        setError("");
    };

    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {
        setEditMode(false);

        setFormData({
            name: user?.name || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });

        setError("");
        setSuccess("");
    };

    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSaveProfile = async () => {
        try {
            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            if (!formData.name.trim()) {
                setError("Name is required.");
                return;
            }

            setSaving(true);
            setError("");
            setSuccess("");

            const response = await axios.put(
                `${backendUrl}/api/user/profile`,
                {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                },
                {
                    headers: {
                        token,
                    },
                }
            );

            console.log(
                "UPDATE PROFILE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setUser(response.data.user);

                setFormData({
                    name:
                        response.data.user.name || "",
                    phone:
                        response.data.user.phone || "",
                    address:
                        response.data.user.address || "",
                });

                setEditMode(false);

                setSuccess(
                    "Profile updated successfully."
                );
            } else {
                setError(
                    response.data.message ||
                        "Unable to update profile."
                );
            }
        } catch (err) {
            console.error(
                "UPDATE PROFILE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // PASSWORD INPUT
    // ==========================================

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPasswordMessage("");
    };

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPasswordMessage("");

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            setPasswordMessage(
                "Please fill in all password fields."
            );
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage(
                "New password must contain at least 8 characters."
            );
            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {
            setPasswordMessage(
                "New passwords do not match."
            );
            return;
        }

        try {
            const token = getToken();

            setChangingPassword(true);

            const response = await axios.put(
                `${backendUrl}/api/user/change-password`,
                {
                    currentPassword:
                        passwordData.currentPassword,
                    newPassword:
                        passwordData.newPassword,
                },
                {
                    headers: {
                        token,
                    },
                }
            );

            if (response.data.success) {
                setPasswordMessage(
                    "Password changed successfully."
                );

                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                setPasswordMessage(
                    response.data.message ||
                        "Unable to change password."
                );
            }
        } catch (err) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                err
            );

            setPasswordMessage(
                err.response?.data?.message ||
                    "Unable to change password."
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");

        // Remove guest cart if you want a clean logout
        localStorage.removeItem("cartItems");

        navigate("/login");
    };

    // ==========================================
    // ORDERS
    // ==========================================

    const handleOrders = () => {
        navigate("/orders");
    };

    // ==========================================
    // SHOPPING
    // ==========================================

    const handleShopping = () => {
        navigate("/collection");
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading-card">
                    <div className="profile-spinner"></div>

                    <p>
                        Loading your account...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error && !user) {
        return (
            <div className="profile-page">
                <div className="profile-error-card">
                    <div className="profile-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load profile
                    </h2>

                    <p>{error}</p>

                    <button
                        className="profile-primary-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // INITIAL
    // ==========================================

    const initial =
        user?.name?.charAt(0)?.toUpperCase() ||
        "U";

    return (
        <div className="profile-page">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="profile-container">

                <div className="profile-page-heading">

                    <div>
                        <span className="profile-eyebrow">
                            MY ACCOUNT
                        </span>

                        <h1>
                            Welcome back,
                            <span>
                                {" "}
                                {user?.name || "User"}
                            </span>
                        </h1>

                        <p>
                            Manage your personal
                            information, orders and
                            account preferences.
                        </p>
                    </div>

                    <button
                        className="profile-shop-btn"
                        onClick={handleShopping}
                    >
                        Continue Shopping
                    </button>

                </div>

                {/* =====================================
                    SUCCESS / ERROR
                ===================================== */}

                {success && (
                    <div className="profile-alert success">
                        <span>✓</span>
                        {success}
                    </div>
                )}

                {error && user && (
                    <div className="profile-alert error">
                        <span>!</span>
                        {error}
                    </div>
                )}

                {/* =====================================
                    MAIN GRID
                ===================================== */}

                <div className="profile-layout">

                    {/* =================================
                        LEFT SIDEBAR
                    ================================= */}

                    <aside className="profile-sidebar">

                        <div className="profile-user-card">

                            <div className="profile-avatar-large">
                                {initial}
                            </div>

                            <h2>
                                {user?.name || "User"}
                            </h2>

                            <p>
                                {user?.email || ""}
                            </p>

                            <div className="profile-member">
                                <span className="profile-status-dot"></span>
                                Active account
                            </div>

                        </div>

                        <nav className="profile-nav">

                            <button
                                className="active"
                                type="button"
                            >
                                <span>◎</span>
                                Account Overview
                            </button>

                            <button
                                type="button"
                                onClick={handleOrders}
                            >
                                <span>▣</span>
                                My Orders
                            </button>

                            <button
                                type="button"
                                onClick={handleShopping}
                            >
                                <span>♡</span>
                                Continue Shopping
                            </button>

                        </nav>

                        <button
                            className="profile-logout-btn"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </aside>

                    {/* =================================
                        MAIN CONTENT
                    ================================= */}

                    <main className="profile-main">

                        {/* ACCOUNT OVERVIEW */}

                        <section className="profile-section">

                            <div className="section-heading">
                                <div>
                                    <span className="section-number">
                                        01
                                    </span>

                                    <div>
                                        <h2>
                                            Personal Information
                                        </h2>

                                        <p>
                                            Your basic account
                                            information.
                                        </p>
                                    </div>
                                </div>

                                {!editMode && (
                                    <button
                                        className="section-edit-btn"
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {!editMode ? (

                                <div className="profile-info-grid">

                                    <div className="profile-info-box">
                                        <span>
                                            FULL NAME
                                        </span>

                                        <strong>
                                            {user?.name ||
                                                "Not provided"}
                                        </strong>
                                    </div>

                                    <div className="profile-info-box">
                                        <span>
                                            EMAIL ADDRESS
                                        </span>

                                        <strong>
                                            {user?.email ||
                                                "Not provided"}
                                        </strong>

                                        <small>
                                            Email cannot be
                                            changed here.
                                        </small>
                                    </div>

                                    <div className="profile-info-box">
                                        <span>
                                            PHONE NUMBER
                                        </span>

                                        <strong>
                                            {user?.phone ||
                                                "Not provided"}
                                        </strong>
                                    </div>

                                    <div className="profile-info-box">
                                        <span>
                                            ADDRESS
                                        </span>

                                        <strong>
                                            {user?.address ||
                                                "Not provided"}
                                        </strong>
                                    </div>

                                </div>

                            ) : (

                                <div className="profile-edit-form">

                                    <div className="profile-form-grid">

                                        <div className="profile-field">
                                            <label>
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    formData.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="profile-field">
                                            <label>
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                value={
                                                    user?.email ||
                                                    ""
                                                }
                                                disabled
                                            />
                                        </div>

                                        <div className="profile-field">
                                            <label>
                                                Phone Number
                                            </label>

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    formData.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        <div className="profile-field profile-field-full">
                                            <label>
                                                Address
                                            </label>

                                            <textarea
                                                name="address"
                                                value={
                                                    formData.address
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter your delivery address"
                                                rows="4"
                                            />
                                        </div>

                                    </div>

                                    <div className="profile-form-actions">

                                        <button
                                            className="profile-cancel-btn"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="profile-save-btn"
                                            onClick={
                                                handleSaveProfile
                                            }
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                    </div>

                                </div>
                            )}

                        </section>

                        {/* QUICK ACTIONS */}

                        <section className="profile-section">

                            <div className="section-heading">

                                <div>
                                    <span className="section-number">
                                        02
                                    </span>

                                    <div>
                                        <h2>
                                            Quick Actions
                                        </h2>

                                        <p>
                                            Frequently used
                                            account options.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <div className="profile-action-grid">

                                <button
                                    className="profile-action-card"
                                    onClick={handleOrders}
                                >
                                    <span className="action-icon">
                                        ↗
                                    </span>

                                    <div>
                                        <strong>
                                            My Orders
                                        </strong>

                                        <p>
                                            View order history
                                            and status.
                                        </p>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>

                                <button
                                    className="profile-action-card"
                                    onClick={handleShopping}
                                >
                                    <span className="action-icon">
                                        +
                                    </span>

                                    <div>
                                        <strong>
                                            Shop Collection
                                        </strong>

                                        <p>
                                            Discover new
                                            products.
                                        </p>
                                    </div>

                                    <span className="action-arrow">
                                        →
                                    </span>
                                </button>

                            </div>

                        </section>

                        {/* ADDRESS */}

                        <section className="profile-section">

                            <div className="section-heading">

                                <div>
                                    <span className="section-number">
                                        03
                                    </span>

                                    <div>
                                        <h2>
                                            Delivery Address
                                        </h2>

                                        <p>
                                            Your default
                                            delivery address.
                                        </p>
                                    </div>
                                </div>

                                {!editMode && (
                                    <button
                                        className="section-edit-btn"
                                        onClick={handleEdit}
                                    >
                                        Manage
                                    </button>
                                )}

                            </div>

                            <div className="address-card">

                                <div className="address-icon">
                                    ⌖
                                </div>

                                <div>
                                    <span>
                                        DEFAULT ADDRESS
                                    </span>

                                    <strong>
                                        {user?.name ||
                                            "Your Name"}
                                    </strong>

                                    <p>
                                        {user?.address ||
                                            "No delivery address added yet."}
                                    </p>

                                    {user?.phone && (
                                        <small>
                                            Phone:{" "}
                                            {user.phone}
                                        </small>
                                    )}
                                </div>

                            </div>

                        </section>

                        {/* SECURITY */}

                        <section className="profile-section">

                            <div className="section-heading">

                                <div>
                                    <span className="section-number">
                                        04
                                    </span>

                                    <div>
                                        <h2>
                                            Account Security
                                        </h2>

                                        <p>
                                            Keep your account
                                            protected.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            <form
                                className="password-form"
                                onSubmit={
                                    handleChangePassword
                                }
                            >

                                <div className="profile-field">
                                    <label>
                                        Current Password
                                    </label>

                                    <div className="password-input-wrap">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="currentPassword"
                                            value={
                                                passwordData.currentPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Current password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="profile-field">
                                    <label>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={
                                            passwordData.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label>
                                        Confirm New Password
                                    </label>

                                    <div className="password-input-wrap">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={
                                                passwordData.confirmPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                            placeholder="Confirm new password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="password-actions">

                                    {passwordMessage && (
                                        <p
                                            className={
                                                passwordMessage.includes(
                                                    "successfully"
                                                )
                                                    ? "password-success"
                                                    : "password-error"
                                            }
                                        >
                                            {passwordMessage}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="profile-save-btn"
                                        disabled={
                                            changingPassword
                                        }
                                    >
                                        {changingPassword
                                            ? "Updating..."
                                            : "Update Password"}
                                    </button>

                                </div>

                            </form>

                        </section>

                        {/* DANGER ZONE */}

                        <section className="profile-danger">

                            <div>
                                <span>
                                    ACCOUNT
                                </span>

                                <h3>
                                    Sign out of your account
                                </h3>

                                <p>
                                    You can safely sign out
                                    from this device.
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </section>

                    </main>

                </div>

            </div>
        </div>
    );
};

export default Profile;