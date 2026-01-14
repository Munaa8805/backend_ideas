import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
const router = express.Router();

//@query /api/v1/products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      price,
      image,
      category,
      subCategory,
      brand,
      color,
      size,
      quantity,
      description,
    } = req.body || {};
    if (
      !name?.trim() ||
      !price?.trim() ||
      !category?.trim() ||
      !brand?.trim() ||
      !description?.trim()
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (price <= 0) {
      res.status(400);
      throw new Error("Price must be greater than 0");
    }
    if (quantity <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than 0");
    }
    if (image?.length === 0) {
      res.status(400);
      throw new Error("Image is required");
    }
    if (category?.length === 0) {
      res.status(400);
      throw new Error("Category is required");
    }
    if (brand?.length === 0) {
      res.status(400);
      throw new Error("Brand is required");
    }
    if (description?.length === 0) {
      res.status(400);
      throw new Error("Description is required");
    }
    const product = await Product.create({
      name,
      price,
      image,
      category,
      subCategory,
      brand,
      color,
      size,
      quantity,
      description,
    });
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const {
      name,
      price,
      image,
      category,
      subCategory,
      brand,
      color,
      size,
      quantity,
      description,
    } = req.body || {};

    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      res.status(404);
      throw new Error("Product not found");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        image,
        category,
        subCategory,
        brand,
        color,
        size,
        quantity,
        description,
      },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      res.status(404);
      throw new Error("Product not found");
    }
    const product = await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
