import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import productModel from "./models/productModel.js";

// ==========================================
// CLOUDINARY
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// ==========================================
// PATHS
// ==========================================

const assetsFile = path.join(
  process.cwd(),
  "../frontend/src/assets/assets.js"
);

const assetsFolder = path.join(
  process.cwd(),
  "../frontend/src/assets"
);

// ==========================================
// GET PRODUCTS FROM assets.js
// ==========================================

function getProducts() {
  const text = fs.readFileSync(
    assetsFile,
    "utf8"
  );

  const start = text.indexOf(
    "export const products = ["
  );

  if (start === -1) {
    throw new Error(
      "products array not found in assets.js"
    );
  }

  const arrayStart = text.indexOf(
    "[",
    start
  );

  let depth = 0;
  let arrayEnd = -1;

  for (
    let i = arrayStart;
    i < text.length;
    i++
  ) {
    if (text[i] === "[") {
      depth++;
    }

    if (text[i] === "]") {
      depth--;

      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }

  if (arrayEnd === -1) {
    throw new Error(
      "Could not find end of products array"
    );
  }

  const productsText = text.substring(
    arrayStart + 1,
    arrayEnd
  );

  const products = [];

  let objectStart = -1;
  let objectDepth = 0;

  for (
    let i = 0;
    i < productsText.length;
    i++
  ) {
    if (productsText[i] === "{") {
      if (objectDepth === 0) {
        objectStart = i;
      }

      objectDepth++;
    }

    if (productsText[i] === "}") {
      objectDepth--;

      if (
        objectDepth === 0 &&
        objectStart !== -1
      ) {
        const objectText =
          productsText.substring(
            objectStart,
            i + 1
          );

        const product =
          parseProduct(objectText);

        if (product) {
          products.push(product);
        }

        objectStart = -1;
      }
    }
  }

  return products;
}

// ==========================================
// PARSE PRODUCT
// ==========================================

function parseProduct(text) {
  const nameMatch = text.match(
    /name\s*:\s*"([^"]*)"/
  );

  if (!nameMatch) {
    return null;
  }

  const descriptionMatch =
    text.match(
      /description\s*:\s*"([^"]*)"/
    );

  const priceMatch =
    text.match(
      /price\s*:\s*(\d+(?:\.\d+)?)/
    );

  const categoryMatch =
    text.match(
      /category\s*:\s*"([^"]*)"/
    );

  const subCategoryMatch =
    text.match(
      /subCategory\s*:\s*"([^"]*)"/
    );

  const dateMatch =
    text.match(
      /date\s*:\s*(\d+)/
    );

  const bestSellerMatch =
    text.match(
      /bestSeller\s*:\s*(true|false)/
    );

  // ========================================
  // SIZES
  // ========================================

  const sizesMatch =
    text.match(
      /sizes\s*:\s*\[([\s\S]*?)\]/
    );

  let sizes = [];

  if (sizesMatch) {
    sizes = [
      ...sizesMatch[1].matchAll(
        /"([^"]+)"/g
      ),
    ].map(
      (match) => match[1]
    );
  }

  // ========================================
  // IMAGES
  // ========================================

  const imageMatch =
    text.match(
      /image\s*:\s*\[([\s\S]*?)\]/
    );

  let imageFiles = [];

  if (imageMatch) {
    imageFiles =
      imageMatch[1]
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);
  }

  return {
    name: nameMatch[1],

    description:
      descriptionMatch
        ? descriptionMatch[1]
        : "",

    price:
      priceMatch
        ? Number(priceMatch[1])
        : 0,

    category:
      categoryMatch
        ? categoryMatch[1]
        : "",

    subCategory:
      subCategoryMatch
        ? subCategoryMatch[1]
        : "",

    sizes,

    bestSeller:
      bestSellerMatch
        ? bestSellerMatch[1] ===
          "true"
        : false,

    date:
      dateMatch
        ? Number(dateMatch[1])
        : Date.now(),

    imageFiles,
  };
}

// ==========================================
// UPLOAD IMAGE
// ==========================================

async function uploadImage(
  imageVariable
) {
  const imagePath = path.join(
    assetsFolder,
    imageVariable + ".png"
  );

  console.log(
    "Checking:",
    imagePath
  );

  if (!fs.existsSync(imagePath)) {
    throw new Error(
      `Image not found: ${imagePath}`
    );
  }

  console.log(
    "Uploading:",
    imageVariable
  );

  const result =
    await cloudinary.uploader.upload(
      imagePath,
      {
        resource_type: "image",
        folder:
          "ecommerce-products",
      }
    );

  return result.secure_url;
}

// ==========================================
// SEED PRODUCTS
// ==========================================

async function seedProducts() {
  try {
    console.log("");
    console.log(
      "================================"
    );
    console.log(
      "STARTING PRODUCT IMPORT"
    );
    console.log(
      "================================"
    );

    // ======================================
    // CHECK MONGODB URI
    // ======================================

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI missing in .env"
      );
    }

    // ======================================
    // CONNECT TO SAME DATABASE AS SERVER
    // ======================================

    console.log(
      "Connecting MongoDB..."
    );

    await mongoose.connect(
      `${process.env.MONGODB_URI}/e-commerce`
    );

    console.log(
      "MongoDB Connected"
    );

    // ======================================
    // GET PRODUCTS
    // ======================================

    const products =
      getProducts();

    console.log(
      `Found ${products.length} products`
    );

    // ======================================
    // ADD PRODUCTS
    // ======================================

    let added = 0;
    let skipped = 0;

    for (const product of products) {
      console.log("");
      console.log(
        "-------------------------------"
      );

      console.log(
        "Product:",
        product.name
      );

      // Check duplicate
      const exists =
        await productModel.findOne({
          name: product.name,
        });

      if (exists) {
        console.log(
          "Already exists - SKIPPED"
        );

        skipped++;

        continue;
      }

      // ====================================
      // UPLOAD IMAGES
      // ====================================

      const imageUrls = [];

      for (
        const imageFile of
        product.imageFiles
      ) {
        const url =
          await uploadImage(
            imageFile
          );

        imageUrls.push(url);
      }

      // ====================================
      // PRODUCT DATA
      // ====================================

      const productData = {
        name:
          product.name,

        description:
          product.description,

        price:
          product.price,

        image:
          imageUrls,

        category:
          product.category,

        subCategory:
          product.subCategory,

        sizes:
          product.sizes,

        bestSeller:
          product.bestSeller,

        date:
          product.date,
      };

      // ====================================
      // SAVE TO MONGODB
      // ====================================

      await productModel.create(
        productData
      );

      added++;

      console.log(
        "PRODUCT ADDED:",
        product.name
      );
    }

    // ======================================
    // FINAL COUNT
    // ======================================

    const total =
      await productModel.countDocuments();

    console.log("");
    console.log(
      "================================"
    );
    console.log(
      "IMPORT FINISHED"
    );
    console.log(
      "================================"
    );

    console.log(
      "Added:",
      added
    );

    console.log(
      "Skipped:",
      skipped
    );

    console.log(
      "TOTAL PRODUCTS:",
      total
    );

    console.log(
      "================================"
    );

  } catch (error) {
    console.log("");
    console.log(
      "IMPORT ERROR:"
    );

    console.log(
      error.message
    );

  } finally {
    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected"
    );
  }
}

// ==========================================
// RUN
// ==========================================

seedProducts();