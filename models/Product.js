import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
      required: false,
      default: [],
    },
    category: {
      type: [String],
      required: true,
      default: [],
    },
    subCategory: {
      type: String,
      required: false,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: false,
      trim: true,
    },
    size: {
      type: String,
      required: false,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
