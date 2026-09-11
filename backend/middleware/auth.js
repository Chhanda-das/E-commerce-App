import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.token;

        console.log("");
        console.log("================================");
        console.log("AUTH MIDDLEWARE");
        console.log("================================");

        console.log(
            "TOKEN:",
            token ? "FOUND" : "NOT FOUND"
        );

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again",
            });
        }

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
            "TOKEN DECODE:",
            token_decode
        );

        req.userId = token_decode.id;

        console.log(
            "USER ID:",
            req.userId
        );

        next();

    } catch (error) {

        console.log(
            "AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

export default auth;