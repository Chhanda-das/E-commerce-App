import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ==========================================
// STRIPE
// ==========================================

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);

console.log(
    "ORDER CONTROLLER STRIPE KEY:",
    process.env.STRIPE_SECRET_KEY
        ? "LOADED"
        : "NOT LOADED"
);

// ==========================================
// RAZORPAY
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// HELPER
// GET USER ID
// ==========================================

const getUserId = (req) => {
    return (
        req.userId ||
        req.body?.userId ||
        req.body?.user_id
    );
};

// ==========================================
// HELPER
// CREATE ORDER DATA
// ==========================================

const createOrderData = ({
    userId,
    items,
    amount,
    address,
    paymentMethod,
    payment,
}) => {
    return {
        userId: String(userId),
        items,
        amount: Number(amount),
        address,
        paymentMethod,
        payment: Boolean(payment),
        date: Date.now(),
    };
};

// ==========================================
// PLACE ORDER - CASH ON DELIVERY
// ==========================================

const placeOrder = async (req, res) => {
    try {
        console.log("");
        console.log("==============================");
        console.log("PLACE COD ORDER");
        console.log("==============================");

        const userId = getUserId(req);

        const {
            items,
            amount,
            address,
        } = req.body || {};

        console.log(
            "USER ID:",
            userId
        );

        // ----------------------------------
        // VALIDATE USER
        // ----------------------------------

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "User ID missing. Please login again.",
            });
        }

        // ----------------------------------
        // VALIDATE ITEMS
        // ----------------------------------

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order items are required",
            });
        }

        // ----------------------------------
        // VALIDATE AMOUNT
        // ----------------------------------

        if (
            amount === undefined ||
            amount === null ||
            isNaN(Number(amount)) ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid order amount is required",
            });
        }

        // ----------------------------------
        // VALIDATE ADDRESS
        // ----------------------------------

        if (
            !address ||
            typeof address !== "object"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery address is required",
            });
        }

        // ----------------------------------
        // COD IS NOT PAID YET
        // ----------------------------------

        const orderData =
            createOrderData({
                userId,
                items,
                amount,
                address,
                paymentMethod: "COD",
                payment: false,
            });

        console.log(
            "FINAL COD ORDER DATA:",
            orderData
        );

        const order =
            new orderModel(orderData);

        await order.save();

        console.log(
            "COD ORDER CREATED:",
            order._id
        );

        // ----------------------------------
        // CLEAR CART
        // ----------------------------------

        await userModel.findByIdAndUpdate(
            userId,
            {
                cartData: {},
            }
        );

        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.json({
            success: true,
            message:
                "Order placed successfully",
            orderId:
                order._id,
        });

    } catch (error) {
        console.log(
            "PLACE COD ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to place COD order",
        });
    }
};

// ==========================================
// STRIPE - CREATE PAYMENT
// ==========================================

const placeOrderStripe = async (req, res) => {
    try {
        console.log("");
        console.log("==============================");
        console.log("CREATE STRIPE PAYMENT");
        console.log("==============================");

        const userId = getUserId(req);

        const {
            items,
            amount,
            address,
        } = req.body || {};

        // ----------------------------------
        // VALIDATE USER
        // ----------------------------------

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "User ID missing. Please login again.",
            });
        }

        // ----------------------------------
        // VALIDATE ITEMS
        // ----------------------------------

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order items are required",
            });
        }

        // ----------------------------------
        // VALIDATE AMOUNT
        // ----------------------------------

        if (
            amount === undefined ||
            amount === null ||
            isNaN(Number(amount)) ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid order amount is required",
            });
        }

        // ----------------------------------
        // VALIDATE ADDRESS
        // ----------------------------------

        if (
            !address ||
            typeof address !== "object"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery address is required",
            });
        }

        // ----------------------------------
        // CREATE DATABASE ORDER FIRST
        // ----------------------------------

        const orderData =
            createOrderData({
                userId,
                items,
                amount,
                address,
                paymentMethod: "Stripe",
                payment: false,
            });

        const order =
            new orderModel(orderData);

        await order.save();

        console.log(
            "STRIPE MONGODB ORDER CREATED:",
            order._id
        );

        // ----------------------------------
        // STRIPE AMOUNT
        // INR × 100
        // ----------------------------------

        const stripeAmount =
            Math.round(
                Number(amount) * 100
            );

        // ----------------------------------
        // FRONTEND URL
        // ----------------------------------

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        console.log(
            "STRIPE FRONTEND URL:",
            frontendUrl
        );

        // ----------------------------------
        // CREATE STRIPE SESSION
        // ----------------------------------

        const session =
            await stripe.checkout.sessions.create({

                payment_method_types: [
                    "card",
                ],

                line_items: [
                    {
                        price_data: {
                            currency: "inr",

                            product_data: {
                                name:
                                    "E-commerce Order",
                            },

                            unit_amount:
                                stripeAmount,
                        },

                        quantity: 1,
                    },
                ],

                mode: "payment",

                // IMPORTANT
                // Store MongoDB order ID
                metadata: {
                    orderId:
                        String(order._id),
                },

                client_reference_id:
                    String(order._id),

                success_url:
                    `${frontendUrl}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,

                cancel_url:
                    `${frontendUrl}/place-order?canceled=true`,
            });

        console.log(
            "STRIPE SESSION CREATED:",
            session.id
        );

        console.log(
            "STRIPE ORDER ID:",
            String(order._id)
        );

        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.json({
            success: true,

            session_url:
                session.url,

            sessionId:
                session.id,

            orderId:
                order._id,
        });

    } catch (error) {
        console.log(
            "STRIPE ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Stripe payment creation failed",
        });
    }
};

// ==========================================
// VERIFY STRIPE PAYMENT
// ==========================================

const verifyStripePayment =
    async (req, res) => {

        try {

            const {
                sessionId,
                orderId,
            } = req.body || {};

            // ----------------------------------
            // VALIDATE SESSION
            // ----------------------------------

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Stripe session ID is required",
                });
            }

            // ----------------------------------
            // GET STRIPE SESSION
            // ----------------------------------

            const session =
                await stripe.checkout.sessions.retrieve(
                    sessionId
                );

            console.log(
                "STRIPE SESSION ID:",
                session.id
            );

            console.log(
                "STRIPE PAYMENT STATUS:",
                session.payment_status
            );

            console.log(
                "STRIPE METADATA ORDER ID:",
                session.metadata?.orderId
            );

            // ----------------------------------
            // PAYMENT MUST BE PAID
            // ----------------------------------

            if (
                session.payment_status !==
                "paid"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Payment not completed",
                });
            }

            // ----------------------------------
            // GET ORDER ID
            // ----------------------------------

            const finalOrderId =
                orderId ||
                session.metadata?.orderId ||
                session.client_reference_id;

            console.log(
                "FINAL STRIPE ORDER ID:",
                finalOrderId
            );

            if (!finalOrderId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order ID not found",
                });
            }

            // ----------------------------------
            // MARK ORDER AS PAID
            // ----------------------------------

            const updatedOrder =
                await orderModel.findByIdAndUpdate(

                    finalOrderId,

                    {
                        payment: true,
                    },

                    {
                        new: true,
                    }

                );

            if (!updatedOrder) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            console.log(
                "STRIPE ORDER MARKED PAID:",
                updatedOrder._id
            );

            // ----------------------------------
            // CLEAR CART
            // ----------------------------------

            const userId =
                getUserId(req);

            if (userId) {
                await userModel.findByIdAndUpdate(
                    userId,
                    {
                        cartData: {},
                    }
                );
            }

            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            return res.json({
                success: true,
                message:
                    "Payment verified successfully",
            });

        } catch (error) {

            console.log(
                "STRIPE VERIFY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Stripe payment verification failed",
            });
        }
    };

// ==========================================
// RAZORPAY - CREATE ORDER
// ==========================================

const placeOrderRazorpay =
    async (req, res) => {

        try {

            console.log("");
            console.log("==============================");
            console.log("CREATE RAZORPAY ORDER");
            console.log("==============================");

            const userId =
                getUserId(req);

            const {
                items,
                amount,
                address,
            } = req.body || {};

            // ----------------------------------
            // VALIDATE USER
            // ----------------------------------

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "User ID missing. Please login again.",
                });
            }

            // ----------------------------------
            // VALIDATE ITEMS
            // ----------------------------------

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order items are required",
                });
            }

            // ----------------------------------
            // VALIDATE AMOUNT
            // ----------------------------------

            if (
                amount === undefined ||
                amount === null ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Valid order amount is required",
                });
            }

            // ----------------------------------
            // VALIDATE ADDRESS
            // ----------------------------------

            if (
                !address ||
                typeof address !== "object"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Delivery address is required",
                });
            }

            // ----------------------------------
            // CONVERT INR TO PAISE
            // ----------------------------------

            const razorpayAmount =
                Math.round(
                    Number(amount) * 100
                );

            console.log(
                "RAZORPAY AMOUNT:",
                razorpayAmount
            );

            // ----------------------------------
            // CREATE MONGODB ORDER
            // ----------------------------------

            const orderData =
                createOrderData({
                    userId,
                    items,
                    amount,
                    address,
                    paymentMethod: "Razorpay",
                    payment: false,
                });

            const order =
                new orderModel(orderData);

            await order.save();

            console.log(
                "RAZORPAY MONGODB ORDER CREATED:",
                order._id
            );

            // ----------------------------------
            // CREATE RAZORPAY ORDER
            // ----------------------------------

            const razorpayOrder =
                await razorpay.orders.create({

                    amount:
                        razorpayAmount,

                    currency:
                        "INR",

                    receipt:
                        `receipt_${Date.now()}`,

                });

            console.log(
                "RAZORPAY ORDER CREATED:",
                razorpayOrder.id
            );

            // ----------------------------------
            // RESPONSE
            // ----------------------------------

            return res.json({
                success: true,

                message:
                    "Razorpay order created",

                razorpayOrderId:
                    razorpayOrder.id,

                orderId:
                    order._id,

                amount:
                    razorpayAmount,

                currency:
                    "INR",

                key:
                    process.env.RAZORPAY_KEY_ID,
            });

        } catch (error) {

            console.log(
                "RAZORPAY ORDER ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Razorpay order creation failed",
            });
        }
    };

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

const verifyRazorpay =
    async (req, res) => {

        try {

            console.log("");
            console.log("==============================");
            console.log("VERIFY RAZORPAY PAYMENT");
            console.log("==============================");

            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                orderId,
            } = req.body || {};

            // ----------------------------------
            // VALIDATE PAYMENT DATA
            // ----------------------------------

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Razorpay payment details are missing",
                });
            }

            // ----------------------------------
            // ORDER ID REQUIRED
            // ----------------------------------

            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "MongoDB order ID is required",
                });
            }

            // ----------------------------------
            // CREATE SIGNATURE
            // ----------------------------------

            const generatedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.RAZORPAY_KEY_SECRET
                    )
                    .update(
                        `${razorpay_order_id}|${razorpay_payment_id}`
                    )
                    .digest("hex");

            // ----------------------------------
            // VERIFY SIGNATURE
            // ----------------------------------

            if (
                generatedSignature !==
                razorpay_signature
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Razorpay payment signature",
                });
            }

            console.log(
                "RAZORPAY SIGNATURE VERIFIED"
            );

            // ----------------------------------
            // MARK ORDER AS PAID
            // ----------------------------------

            const updatedOrder =
                await orderModel.findByIdAndUpdate(

                    orderId,

                    {
                        payment: true,
                    },

                    {
                        new: true,
                    }

                );

            if (!updatedOrder) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            console.log(
                "RAZORPAY ORDER MARKED PAID:",
                updatedOrder._id
            );

            // ----------------------------------
            // CLEAR CART
            // ----------------------------------

            const userId =
                getUserId(req);

            if (userId) {
                await userModel.findByIdAndUpdate(
                    userId,
                    {
                        cartData: {},
                    }
                );
            }

            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            return res.json({
                success: true,
                message:
                    "Razorpay payment verified successfully",
            });

        } catch (error) {

            console.log(
                "RAZORPAY VERIFY ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Razorpay payment verification failed",
            });
        }
    };

// ==========================================
// ADMIN - ALL ORDERS
// ==========================================

const allOrders =
    async (req, res) => {

        try {

            const orders =
                await orderModel
                    .find({})
                    .sort({
                        date: -1,
                    });

            return res.json({
                success: true,
                orders,
            });

        } catch (error) {

            console.log(
                "ALL ORDERS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to get orders",
            });
        }
    };

// ==========================================
// USER ORDERS
// ==========================================

const userOrders =
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "User ID missing. Please login again.",
                });
            }

            const orders =
                await orderModel
                    .find({
                        userId:
                            String(userId),
                    })
                    .sort({
                        date: -1,
                    });

            return res.json({
                success: true,
                orders,
            });

        } catch (error) {

            console.log(
                "USER ORDERS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to get user orders",
            });
        }
    };

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

const updateStatus =
    async (req, res) => {

        try {

            const {
                orderId,
                status,
            } = req.body || {};

            if (
                !orderId ||
                !status
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order ID and status are required",
                });
            }

            const updatedOrder =
                await orderModel.findByIdAndUpdate(

                    orderId,

                    {
                        status,
                    },

                    {
                        new: true,
                    }

                );

            if (!updatedOrder) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            return res.json({
                success: true,
                message:
                    "Order status updated",
            });

        } catch (error) {

            console.log(
                "UPDATE STATUS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update order status",
            });
        }
    };

// ==========================================
// EXPORT
// ==========================================

export {
    placeOrder,
    placeOrderStripe,
    verifyStripePayment,

    placeOrderRazorpay,
    verifyRazorpay,

    allOrders,
    userOrders,
    updateStatus,
};