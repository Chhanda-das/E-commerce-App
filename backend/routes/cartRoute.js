import express from "express";

import {
    addToCart,
    updateCart,
    getUserCart
} from "../controllers/cartController.js";

import auth from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post(
    "/add",
    auth,
    addToCart
);

cartRouter.post(
    "/update",
    auth,
    updateCart
);

cartRouter.post(
    "/get",
    auth,
    getUserCart
);

export default cartRouter;