import userModel from "../models/userModel.js";

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;

        // USER ID COMES FROM AUTH MIDDLEWARE
        const userId = req.userId;

        console.log("================================");
        console.log("ADD TO CART");
        console.log("USER ID:", userId);
        console.log("ITEM ID:", itemId);
        console.log("SIZE:", size);
        console.log("================================");

        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is missing",
            });
        }

        // Check product data
        if (!itemId || !size) {
            return res.json({
                success: false,
                message: "Item ID and size are required",
            });
        }

        // Find user
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get existing cart
        let cartData = userData.cartData || {};

        // ======================================
        // PRODUCT ALREADY EXISTS
        // ======================================

        if (cartData[itemId]) {

            // SIZE ALREADY EXISTS
            if (cartData[itemId][size]) {

                cartData[itemId][size] =
                    Number(cartData[itemId][size]) + 1;

            } else {

                // NEW SIZE
                cartData[itemId][size] = 1;
            }

        }

        // ======================================
        // NEW PRODUCT
        // ======================================

        else {

            cartData[itemId] = {
                [size]: 1,
            };
        }

        // ======================================
        // SAVE CART
        // ======================================

        await userModel.findByIdAndUpdate(
            userId,
            {
                cartData,
            }
        );

        return res.json({
            success: true,
            message: "Added to Cart",
        });

    } catch (error) {

        console.error("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// UPDATE CART
// ==========================================

const updateCart = async (req, res) => {
    try {

        const {
            itemId,
            size,
            quantity,
        } = req.body;

        // USER ID COMES FROM AUTH MIDDLEWARE
        const userId = req.userId;

        console.log("================================");
        console.log("UPDATE CART");
        console.log("USER ID:", userId);
        console.log("ITEM ID:", itemId);
        console.log("SIZE:", size);
        console.log("QUANTITY:", quantity);
        console.log("================================");

        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is missing",
            });
        }

        // Check data
        if (
            !itemId ||
            !size ||
            quantity === undefined
        ) {
            return res.json({
                success: false,
                message: "Missing required data",
            });
        }

        // Convert quantity to number
        const newQuantity = Number(quantity);

        if (
            Number.isNaN(newQuantity) ||
            newQuantity < 0
        ) {
            return res.json({
                success: false,
                message: "Invalid quantity",
            });
        }

        // Find user
        const userData =
            await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Get cart
        let cartData =
            userData.cartData || {};

        // ======================================
        // PRODUCT DOES NOT EXIST
        // ======================================

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        // ======================================
        // QUANTITY = 0
        // REMOVE ITEM/SIZE
        // ======================================

        if (newQuantity === 0) {

            delete cartData[itemId][size];

            // If no sizes remain
            if (
                Object.keys(
                    cartData[itemId]
                ).length === 0
            ) {
                delete cartData[itemId];
            }

        }

        // ======================================
        // UPDATE QUANTITY
        // ======================================

        else {

            cartData[itemId][size] =
                newQuantity;
        }

        // ======================================
        // SAVE CART
        // ======================================

        await userModel.findByIdAndUpdate(
            userId,
            {
                cartData,
            }
        );

        return res.json({
            success: true,
            message: "Cart Updated",
        });

    } catch (error) {

        console.error("UPDATE CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// GET USER CART
// ==========================================

const getUserCart = async (req, res) => {

    try {

        // IMPORTANT:
        // USER ID COMES FROM AUTH MIDDLEWARE
        const userId = req.userId;

        console.log("================================");
        console.log("GET USER CART");
        console.log("USER ID:", userId);
        console.log("================================");

        // Check authentication
        if (!userId) {

            return res.status(401).json({
                success: false,
                message: "User ID is missing",
            });
        }

        // Find user
        const userData =
            await userModel.findById(userId);

        if (!userData) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ======================================
        // GET CART DATA
        // ======================================

        const cartData =
            userData.cartData || {};

        console.log(
            "CART DATA:",
            cartData
        );

        // ======================================
        // SEND CART
        // ======================================

        return res.json({
            success: true,
            cartData,
        });

    } catch (error) {

        console.error("GET USER CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

export {
    addToCart,
    updateCart,
    getUserCart,
};