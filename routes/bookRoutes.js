import express from "express";

import Book from "../models/Book.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, caption, author, rating, image } = req.body || {};

    let imageUrl = "";
    if (!name?.trim() || !caption?.trim() || !author?.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }
    console.log("image", image);

    // const uploadedImage = await cloudinary.uploader.upload(image);
    // imageUrl = uploadedImage.secure_url;

    const newBook = await Book.create({
      name,
      caption,
      author,
      rating,
      // image: imageUrl,
    });

    const savedBook = await newBook.save();

    res
      .status(200)
      .json({ message: "Books fetched successfully", data: savedBook });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find();
    res
      .status(200)
      .json({ message: "Books fetched successfully", data: books });
  } catch (error) {
    next(error);
  }
});

export default router;
