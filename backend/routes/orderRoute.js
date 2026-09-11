import express from "express";

import {
    placeOrder,
    placeOrderStripe,
    verifyStripePayment,

    // RAZORPAY
    placeOrderRazorpay,
    verifyRazorpay,

    allOrders,
    userOrders,
    updateStatus,
} from "../controllers/orderController.js";

import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();


// ==========================================
// ADMIN
// ==========================================

// GET ALL ORDERS
orderRouter.post(
    "/list",
    adminAuth,
    allOrders
);


// UPDATE ORDER STATUS
orderRouter.post(
    "/status",
    adminAuth,
    updateStatus
);


// ==========================================
// USER / CASH ON DELIVERY
// ==========================================

orderRouter.post(
    "/place",
    authUser,
    placeOrder
);


// ==========================================
// USER / STRIPE
// ==========================================

// CREATE STRIPE PAYMENT
orderRouter.post(
    "/stripe",
    authUser,
    placeOrderStripe
);


// VERIFY STRIPE PAYMENT
orderRouter.post(
    "/verify-stripe",
    authUser,
    verifyStripePayment
);


// ==========================================
// USER / RAZORPAY
// ==========================================

// CREATE RAZORPAY ORDER
orderRouter.post(
    "/razorpay",
    authUser,
    placeOrderRazorpay
);


// VERIFY RAZORPAY PAYMENT
orderRouter.post(
    "/verify-razorpay",
    authUser,
    verifyRazorpay
);


// ==========================================
// USER ORDERS
// ==========================================

// GET LOGGED-IN USER ORDERS
orderRouter.post(
    "/userorders",
    authUser,
    userOrders
);


export default orderRouter;