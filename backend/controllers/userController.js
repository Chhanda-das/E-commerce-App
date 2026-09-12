import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";

// ==========================================
// CREATE USER TOKEN
// ==========================================

const createToken = (id) => {
    return jwt.sign(
        {
            id: id.toString(),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ==========================================
// COOKIE OPTIONS
// ==========================================

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        console.log("");
        console.log("================================");
        console.log("USER REGISTER");
        console.log("================================");

        console.log("Name:", name);
        console.log("Email:", email);

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Please enter all required fields",
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        const exists = await userModel.findOne({
            email: email.toLowerCase().trim(),
        });

        if (exists) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const newUser = new userModel({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.cookie(
            "token",
            token,
            cookieOptions
        );

        console.log(
            "USER CREATED:",
            user._id
        );

        console.log(
            "USER TOKEN COOKIE SET"
        );

        return res.json({
            success: true,
            message: "Registration successful",
            token: token,
        });

    } catch (error) {
        console.log("");
        console.log("================================");
        console.log("REGISTER ERROR");
        console.log("================================");

        console.error(error);

        if (error.code === 11000) {
            return res.json({
                success: false,
                message: "Email already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Registration failed",
        });
    }
};

// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        console.log("");
        console.log("================================");
        console.log("USER LOGIN");
        console.log("================================");

        console.log("Email:", email);

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createToken(user._id);

        res.cookie(
            "token",
            token,
            cookieOptions
        );

        console.log("LOGIN SUCCESS");
        console.log("USER ID:", user._id);
        console.log("USER TOKEN COOKIE SET");

        return res.json({
            success: true,
            message: "Login successful",
            token: token,
        });

    } catch (error) {
        console.log("");
        console.log("================================");
        console.log("LOGIN ERROR");
        console.log("================================");

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Login failed",
        });
    }
};

// ==========================================
// GET USER PROFILE
// ==========================================

const getProfile = async (req, res) => {
    try {
        console.log("");
        console.log("================================");
        console.log("GET USER PROFILE");
        console.log("================================");

        console.log(
            "USER ID FROM AUTH:",
            req.userId
        );

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is missing",
            });
        }

        const user = await userModel
            .findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log(
            "PROFILE FOUND:",
            user._id
        );

        return res.json({
            success: true,
            user,
        });

    } catch (error) {
        console.log("");
        console.log("================================");
        console.log("PROFILE ERROR");
        console.log("================================");

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch profile",
        });
    }
};

// ==========================================
// ADMIN LOGIN
// ==========================================

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        console.log("");
        console.log("================================");
        console.log("ADMIN LOGIN");
        console.log("================================");

        console.log("Email:", email);

        // ==========================================
        // REQUIRED FIELDS
        // ==========================================

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        // ==========================================
        // CHECK ADMIN CREDENTIALS
        // ==========================================

        if (
            email.trim().toLowerCase() !==
                process.env.ADMIN_EMAIL.trim().toLowerCase() ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            console.log("ADMIN LOGIN FAILED");

            return res.json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        // ==========================================
        // CREATE ADMIN TOKEN
        // ==========================================

        const token = jwt.sign(
            {
                email: process.env.ADMIN_EMAIL,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // ==========================================
        // SET ADMIN COOKIE
        // ==========================================

        res.cookie(
            "adminToken",
            token,
            cookieOptions
        );

        console.log("");
        console.log("ADMIN LOGIN SUCCESS");
        console.log("ADMIN TOKEN CREATED");
        console.log("ADMIN TOKEN COOKIE SET");

        // ==========================================
        // DEBUG
        // ==========================================

        console.log("ADMIN TOKEN:");
        console.log(token);

        // ==========================================
        // RETURN TOKEN TO EXISTING FRONTEND
        // ==========================================

        return res.json({
            success: true,
            message: "Admin login successful",
            token: token,
        });

    } catch (error) {
        console.log("");
        console.log("================================");
        console.log("ADMIN LOGIN ERROR");
        console.log("================================");

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Admin login failed",
        });
    }
};

// ==========================================
// EXPORT
// ==========================================

export {
    registerUser,
    loginUser,
    getProfile,
    adminLogin,
};