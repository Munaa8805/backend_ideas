import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, caption, author, rating, image } = req.body;

    if (!image || !name || !caption || !rating || !author) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newBook = new Book({
      name,
      caption,
      author,
      rating,
      image: imageUrl,
      // user: req.user._id,
    });
    console.log("name", name);
    

    await newBook.save();

    res.status(201).json({
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
