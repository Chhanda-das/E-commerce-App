import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/mongodb.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// ==========================================
// APP
// ==========================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true,
    })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// SERVER DEBUG
// ==========================================

app.use((req, res, next) => {
    console.log("");
    console.log("========================================");
    console.log("REQUEST RECEIVED");
    console.log("========================================");

    console.log(
        "METHOD:",
        req.method
    );

    console.log(
        "URL:",
        req.originalUrl
    );

    console.log(
        "USER TOKEN:",
        req.cookies?.token
            ? "FOUND"
            : "NOT FOUND"
    );

    console.log(
        "ADMIN TOKEN:",
        req.cookies?.adminToken
            ? "FOUND"
            : "NOT FOUND"
    );

    console.log("========================================");

    next();
});

// ==========================================
// ADMIN LOGIN DEBUG
// ==========================================

app.use(
    "/api/user/admin",
    (req, res, next) => {
        console.log("");
        console.log("****************************************");
        console.log("ADMIN LOGIN ROUTE REACHED");
        console.log("****************************************");

        console.log(
            "METHOD:",
            req.method
        );

        console.log(
            "URL:",
            req.originalUrl
        );

        console.log(
            "BODY:",
            {
                email: req.body?.email,
                password: req.body?.password
                    ? "RECEIVED"
                    : "NOT RECEIVED",
            }
        );

        console.log("****************************************");

        next();
    }
);

// ==========================================
// USER ROUTES
// ==========================================

app.use(
    "/api/user",
    userRouter
);

// ==========================================
// PRODUCT ROUTES
// ==========================================

app.use(
    "/api/product",
    productRouter
);

// ==========================================
// CART ROUTES
// ==========================================

app.use(
    "/api/cart",
    cartRouter
);

// ==========================================
// ORDER ROUTES
// ==========================================

app.use(
    "/api/order",
    orderRouter
);

// ==========================================
// ROOT API
// ==========================================

app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,
            message: "Forever API is running",
        });
    }
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,
            message:
                `Route not found: ${req.method} ${req.originalUrl}`,
        });
    }
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (error, req, res, next) => {
        console.error(
            "SERVER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal Server Error",
        });
    }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {
        console.log("");
        console.log("========================================");
        console.log("🚀 FOREVER BACKEND STARTED");
        console.log("========================================");

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            "ADMIN API:",
            `http://localhost:${PORT}/api/user/admin`
        );

        console.log(
            "ADMIN EMAIL:",
            process.env.ADMIN_EMAIL
        );

        console.log("========================================");
        console.log("");
    }
);