import mongoose from "mongoose";
import productModel from "./models/productModel.js";


// ======================================================
// MONGODB CONNECTION
// ======================================================

// IMPORTANT:
// Copy the SAME MongoDB connection URL that your
// server.js / index.js currently uses.

const MONGO_URI =
  "YOUR_MONGODB_CONNECTION_STRING";


// ======================================================
// FOOTWEAR PRODUCTS
// ======================================================

const footwearProducts = [

  {
    name: "Classic Leather Sneakers",
    description:
      "Classic leather sneakers designed for everyday comfort and effortless style.",
    price: 2499,
    image: ["f1.jpg"],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Minimal White Sneakers",
    description:
      "Minimal white sneakers with a clean modern silhouette.",
    price: 2299,
    image: ["f2.jpg"],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Everyday Casual Shoes",
    description:
      "Comfortable casual shoes made for everyday wear.",
    price: 1999,
    image: ["f3.jpg"],
    category: "Footwear",
    subCategory: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Premium Running Shoes",
    description:
      "Lightweight running shoes designed for active everyday movement.",
    price: 2899,
    image: ["f4.jpg"],
    category: "Footwear",
    subCategory: "Running Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Classic Black Shoes",
    description:
      "Classic black footwear with a timeless finish.",
    price: 2599,
    image: ["f5.jpg"],
    category: "Footwear",
    subCategory: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Modern Lifestyle Sneakers",
    description:
      "Modern sneakers created for everyday lifestyle wear.",
    price: 2799,
    image: ["f6.jpg"],
    category: "Footwear",
    subCategory: "Lifestyle Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Comfort Sandals",
    description:
      "Comfortable sandals designed for relaxed everyday use.",
    price: 1299,
    image: ["f7.jpg"],
    category: "Footwear",
    subCategory: "Sandals",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Premium Casual Sneakers",
    description:
      "Premium casual sneakers combining comfort and modern style.",
    price: 2399,
    image: ["f8.jpg"],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Classic Formal Shoes",
    description:
      "Elegant formal shoes suitable for refined occasions.",
    price: 2999,
    image: ["f9.jpg"],
    category: "Footwear",
    subCategory: "Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Urban Street Sneakers",
    description:
      "Street-inspired sneakers with a contemporary silhouette.",
    price: 2699,
    image: ["f10.jpg"],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Lightweight Running Shoes",
    description:
      "Lightweight shoes built for comfortable daily running.",
    price: 3099,
    image: ["f11.jpg"],
    category: "Footwear",
    subCategory: "Running Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Comfort Everyday Sandals",
    description:
      "Soft and comfortable sandals for everyday movement.",
    price: 1199,
    image: ["f12.jpg"],
    category: "Footwear",
    subCategory: "Sandals",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Classic Chelsea Boots",
    description:
      "Classic Chelsea boots with a timeless design.",
    price: 3499,
    image: ["f13.jpg"],
    category: "Footwear",
    subCategory: "Boots",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Premium Leather Boots",
    description:
      "Premium leather boots designed for lasting everyday style.",
    price: 3999,
    image: ["f14.jpg"],
    category: "Footwear",
    subCategory: "Boots",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Modern Heels",
    description:
      "Modern heels with an elegant everyday silhouette.",
    price: 2199,
    image: ["f15.jpg"],
    category: "Footwear",
    subCategory: "Heels",
    sizes: ["5", "6", "7", "8", "9"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Elegant Classic Heels",
    description:
      "Elegant classic heels designed for sophisticated looks.",
    price: 2499,
    image: ["f16.jpg"],
    category: "Footwear",
    subCategory: "Heels",
    sizes: ["5", "6", "7", "8", "9"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Soft Comfort Slippers",
    description:
      "Soft slippers designed for comfortable everyday use.",
    price: 799,
    image: ["f17.jpg"],
    category: "Footwear",
    subCategory: "Slippers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Premium Home Slippers",
    description:
      "Comfortable premium slippers for relaxed everyday living.",
    price: 899,
    image: ["f18.jpg"],
    category: "Footwear",
    subCategory: "Slippers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Sport Lifestyle Shoes",
    description:
      "Sport-inspired lifestyle shoes designed for everyday comfort.",
    price: 2799,
    image: ["f19.jpg"],
    category: "Footwear",
    subCategory: "Lifestyle Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

  {
    name: "Classic Everyday Sneakers",
    description:
      "Classic sneakers designed for comfortable everyday wear.",
    price: 2199,
    image: ["f20.jpg"],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Performance Running Shoes",
    description:
      "Performance-focused running shoes with lightweight comfort.",
    price: 3299,
    image: ["f21.jpg"],
    category: "Footwear",
    subCategory: "Running Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: true,
    date: Date.now(),
  },

  {
    name: "Premium Lifestyle Shoes",
    description:
      "Premium lifestyle shoes designed for modern everyday looks.",
    price: 2899,
    image: ["f22.jpg"],
    category: "Footwear",
    subCategory: "Lifestyle Shoes",
    sizes: ["6", "7", "8", "9", "10"],
    bestseller: false,
    date: Date.now(),
  },

];


// ======================================================
// INSERT
// ======================================================

const seedFootwear = async () => {

  try {

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected"
    );


    // -----------------------------------------------
    // CHECK EXISTING FOOTWEAR
    // -----------------------------------------------

    const existing =
      await productModel.find({
        category: "Footwear",
      });


    if (existing.length > 0) {

      console.log(
        `Found ${existing.length} existing footwear products.`
      );

      console.log(
        "Footwear was NOT inserted again."
      );

      await mongoose.disconnect();

      return;

    }


    // -----------------------------------------------
    // INSERT
    // -----------------------------------------------

    const inserted =
      await productModel.insertMany(
        footwearProducts
      );


    console.log(
      `Successfully inserted ${inserted.length} footwear products.`
    );


    // -----------------------------------------------
    // SHOW REAL MONGODB IDS
    // -----------------------------------------------

    inserted.forEach(
      (product) => {

        console.log(
          `${product.name} -> ${product._id}`
        );

      }
    );


    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected"
    );


  } catch (error) {

    console.error(
      "FOOTWEAR SEED ERROR:",
      error
    );

    process.exit(1);

  }

};


seedFootwear();