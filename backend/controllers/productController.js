import fs from "fs";
import path from "path";

import productModel from "../models/productModel.js";


// ======================================================
// ADD PRODUCT
// ======================================================

const addProduct = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller
        } = req.body;


        // ------------------------------------------------
        // REQUIRED FIELDS
        // ------------------------------------------------

        if (
            !name ||
            !description ||
            price === undefined ||
            price === null ||
            !category ||
            !subCategory
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });

        }


        // ------------------------------------------------
        // IMAGES
        // ------------------------------------------------

        const image1 =
            req.files?.image1?.[0];

        const image2 =
            req.files?.image2?.[0];

        const image3 =
            req.files?.image3?.[0];

        const image4 =
            req.files?.image4?.[0];


        if (!image1) {

            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });

        }


        const image = [
            image1.filename,
            image2?.filename,
            image3?.filename,
            image4?.filename
        ].filter(Boolean);


        // ------------------------------------------------
        // SIZES
        // ------------------------------------------------

        let productSizes = [];

        if (sizes) {

            if (Array.isArray(sizes)) {

                productSizes = sizes;

            } else {

                try {

                    productSizes =
                        JSON.parse(sizes);

                } catch {

                    productSizes =
                        String(sizes)
                            .split(",")
                            .map(size => size.trim())
                            .filter(Boolean);

                }

            }

        }


        // ------------------------------------------------
        // BESTSELLER
        // ------------------------------------------------

        const isBestseller =
            bestseller === true ||
            bestseller === "true";


        // ------------------------------------------------
        // CREATE PRODUCT
        // ------------------------------------------------

        const productData = {

            name: name.trim(),

            description:
                description.trim(),

            price:
                Number(price),

            image,

            category:
                category.trim(),

            subCategory:
                subCategory.trim(),

            sizes:
                productSizes,

            bestseller:
                isBestseller,

            date:
                Date.now()

        };


        const product =
            new productModel(productData);


        await product.save();


        return res.status(201).json({

            success: true,

            message:
                "Product added successfully",

            product

        });


    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to add product"

        });

    }

};


// ======================================================
// LIST PRODUCTS
// ======================================================

const listProducts = async (req, res) => {

    try {

        const products =
            await productModel
                .find({})
                .sort({
                    date: -1
                });


        return res.status(200).json({

            success: true,

            products

        });


    } catch (error) {

        console.error(
            "LIST PRODUCTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch products"

        });

    }

};


// ======================================================
// REMOVE PRODUCT
// ======================================================

const removeProduct = async (req, res) => {

    try {

        const { id } =
            req.body;


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "Product ID is required"

            });

        }


        const product =
            await productModel.findById(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        // ------------------------------------------------
        // DELETE UPLOADED IMAGES
        // ------------------------------------------------

        if (
            Array.isArray(product.image)
        ) {

            for (
                const imageName
                of product.image
            ) {

                if (!imageName) {
                    continue;
                }


                const imagePath =
                    path.join(
                        process.cwd(),
                        "uploads",
                        imageName
                    );


                if (
                    fs.existsSync(
                        imagePath
                    )
                ) {

                    fs.unlinkSync(
                        imagePath
                    );

                }

            }

        }


        await productModel.findByIdAndDelete(
            id
        );


        return res.status(200).json({

            success: true,

            message:
                "Product removed successfully"

        });


    } catch (error) {

        console.error(
            "REMOVE PRODUCT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to remove product"

        });

    }

};


// ======================================================
// SINGLE PRODUCT
// ======================================================

const singleProduct = async (req, res) => {

    try {

        const { productId } =
            req.body;


        if (!productId) {

            return res.status(400).json({

                success: false,

                message:
                    "Product ID is required"

            });

        }


        const product =
            await productModel.findById(
                productId
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        return res.status(200).json({

            success: true,

            product

        });


    } catch (error) {

        console.error(
            "SINGLE PRODUCT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch product"

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
};