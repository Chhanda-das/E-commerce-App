import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
      default: 0,
    },

    image: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: [
        "Unisex",
        "Men",
        "Women",
        "Kids",
      ],
    },

    productType: {
      type: String,
      required: true,
      trim: true,
    },

    sizes: {
      type: [String],
      required: true,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel =
  mongoose.models.product ||
  mongoose.model(
    "product",
    productSchema
  );

export default productModel;