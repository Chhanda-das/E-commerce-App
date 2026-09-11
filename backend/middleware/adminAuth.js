import jwt from "jsonwebtoken";

// ==========================================
// ADMIN AUTH MIDDLEWARE
// ==========================================

const adminAuth = async (req, res, next) => {
    try {
        console.log("");
        console.log("==============================");
        console.log("ADMIN AUTH CHECK");
        console.log("==============================");

        // ==========================================
        // GET TOKEN FROM HEADER
        // ==========================================

        const token = req.headers.token;

        console.log(
            "Token received:",
            token ? "YES" : "NO"
        );

        // ==========================================
        // TOKEN REQUIRED
        // ==========================================

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again",
            });
        }

        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
            "TOKEN DECODED:",
            decoded
        );

        // ==========================================
        // CHECK ADMIN ROLE
        // ==========================================

        if (decoded.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Not Authorized as Admin",
            });
        }

        // ==========================================
        // SAVE ADMIN INFORMATION
        // ==========================================

        req.admin = decoded;

        console.log("ADMIN AUTH SUCCESS");

        // ==========================================
        // CONTINUE
        // ==========================================

        next();

    } catch (error) {
        console.log("");
        console.log("==============================");
        console.log("ADMIN AUTH ERROR");
        console.log("==============================");

        console.log(
            "ADMIN AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid Admin Token",
        });
    }
};

export default adminAuth;