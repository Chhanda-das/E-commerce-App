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

        items: items,

        amount: Number(amount),

        address: address,

        paymentMethod: paymentMethod,

        payment: Boolean(payment),

        date: Date.now(),
    };

};


// ==========================================
// PLACE ORDER - COD
// ==========================================

const placeOrder = async (req, res) => {

    try {

        console.log("");
        console.log("==============================");
        console.log("PLACE COD ORDER");
        console.log("==============================");

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "USER ID FROM AUTH:",
            req.userId
        );


        const userId = getUserId(req);

        const {
            items,
            amount,
            address,
        } = req.body || {};


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "User ID missing. Please login again.",

            });

        }


        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.json({

                success: false,

                message:
                    "Order items are required",

            });

        }


        if (
            amount === undefined ||
            amount === null ||
            isNaN(Number(amount))
        ) {

            return res.json({

                success: false,

                message:
                    "Order amount is required",

            });

        }


        if (
            !address ||
            typeof address !== "object"
        ) {

            return res.json({

                success: false,

                message:
                    "Delivery address is required",

            });

        }


        const orderData =
            createOrderData({

                userId,

                items,

                amount,

                address,

                paymentMethod:
                    "COD",

                payment: false,

            });


        console.log(
            "FINAL COD ORDER DATA:",
            orderData
        );


        const order =
            new orderModel(
                orderData
            );


        await order.save();


        // Clear user's cart
        await userModel.findByIdAndUpdate(
            userId,
            {
                cartData: {},
            }
        );


        return res.json({

            success: true,

            message:
                "Order placed successfully",

            orderId:
                order._id,

        });


    } catch (error) {

        console.log(
            "PLACE ORDER ERROR:",
            error
        );


        return res.json({

            success: false,

            message:
                error.message,

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


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "User ID missing. Please login again.",

            });

        }


        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.json({

                success: false,

                message:
                    "Order items are required",

            });

        }


        if (
            amount === undefined ||
            amount === null ||
            isNaN(Number(amount))
        ) {

            return res.json({

                success: false,

                message:
                    "Order amount is required",

            });

        }


        if (!address) {

            return res.json({

                success: false,

                message:
                    "Delivery address is required",

            });

        }


        // Stripe expects smallest currency unit
        const stripeAmount =
            Math.round(
                Number(amount) * 100
            );


        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";


        const session =
            await stripe.checkout.sessions.create({

                payment_method_types: [
                    "card",
                ],

                line_items: [

                    {
                        price_data: {

                            currency:
                                "inr",

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

                mode:
                    "payment",

                success_url:
                    `${frontendUrl}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,

                cancel_url:
                    `${frontendUrl}/place-order?canceled=true`,

            });


        // Save pending order
        const orderData =
            createOrderData({

                userId,

                items,

                amount,

                address,

                paymentMethod:
                    "Stripe",

                payment: false,

            });


        const order =
            new orderModel(
                orderData
            );


        await order.save();


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


        return res.json({

            success: false,

            message:
                error.message,

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


            if (!sessionId) {

                return res.json({

                    success: false,

                    message:
                        "Stripe session ID is required",

                });

            }


            const session =
                await stripe.checkout.sessions.retrieve(
                    sessionId
                );


            if (
                session.payment_status !==
                "paid"
            ) {

                return res.json({

                    success: false,

                    message:
                        "Payment not completed",

                });

            }


            if (orderId) {

                await orderModel.findByIdAndUpdate(

                    orderId,

                    {
                        payment: true,
                    }

                );

            }


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


            return res.json({

                success: false,

                message:
                    error.message,

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


            console.log(
                "RAZORPAY BODY:",
                req.body
            );

            console.log(
                "AUTH USER ID:",
                req.userId
            );


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
                !items ||
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
            // RAZORPAY AMOUNT
            // INR × 100
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
            // SAVE ORDER IN MONGODB
            // ----------------------------------

            const orderData =
                createOrderData({

                    userId,

                    items,

                    amount,

                    address,

                    paymentMethod:
                        "Razorpay",

                    payment: false,

                });


            console.log(
                "FINAL RAZORPAY ORDER DATA:",
                orderData
            );


            const order =
                new orderModel(
                    orderData
                );


            await order.save();


            console.log(
                "MONGODB ORDER CREATED:",
                order._id
            );


            // ----------------------------------
            // RESPONSE TO FRONTEND
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
                    error.message,

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
            // CHECK SIGNATURE
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


            // ----------------------------------
            // UPDATE ORDER
            // ----------------------------------

            if (orderId) {

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

            }


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
                    error.message,

            });

        }

    };


// ==========================================
// ADMIN - ALL ORDERS
// ==========================================

const allOrders = async (req, res) => {

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


        return res.json({

            success: false,

            message:
                error.message,

        });

    }

};


// ==========================================
// USER ORDERS
// ==========================================

const userOrders = async (req, res) => {

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


        return res.json({

            success: false,

            message:
                error.message,

        });

    }

};


// ==========================================
// ADMIN - UPDATE STATUS
// ==========================================

const updateStatus = async (req, res) => {

    try {

        const {
            orderId,
            status,
        } = req.body || {};


        if (!orderId || !status) {

            return res.json({

                success: false,

                message:
                    "Order ID and status are required",

            });

        }


        await orderModel.findByIdAndUpdate(

            orderId,

            {
                status,
            }

        );


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


        return res.json({

            success: false,

            message:
                error.message,

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