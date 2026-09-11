import express from "express";

import {
    loginUser,
    registerUser,
    adminLogin,
    getProfile,
} from "../controllers/userController.js";

import auth from "../middleware/auth.js";

const userRouter = express.Router();

// ==========================================
// USER REGISTER
// ==========================================

userRouter.post(
    "/register",
    registerUser
);

// ==========================================
// USER LOGIN
// ==========================================

userRouter.post(
    "/login",
    loginUser
);

// ==========================================
// ADMIN LOGIN
// ==========================================

userRouter.post(
    "/admin",
    adminLogin
);

// ==========================================
// USER PROFILE
// PROTECTED
// ==========================================

userRouter.get(
    "/profile",
    auth,
    getProfile
);
//logout route
userRouter.post('/logout', (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });

});

export default userRouter;