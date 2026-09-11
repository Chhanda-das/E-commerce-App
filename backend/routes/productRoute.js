import express from "express";

import {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
} from "../controllers/productController.js";

import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

// ==========================================
// ADMIN - ADD PRODUCT
// ==========================================

productRouter.post(
    "/add",
    adminAuth,
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]),
    addProduct
);

// ==========================================
// ADMIN - REMOVE PRODUCT
// ==========================================

productRouter.post(
    "/remove",
    adminAuth,
    removeProduct
);

// ==========================================
// ALL PRODUCTS
// ==========================================

productRouter.get(
    "/list",
    listProducts
);

// ==========================================
// SINGLE PRODUCT
// ==========================================

productRouter.post(
    "/single",
    singleProduct
);

export default productRouter;