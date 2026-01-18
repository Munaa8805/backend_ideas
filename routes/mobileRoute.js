import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

/**
 * Create a new book with image upload to Cloudinary (Mobile endpoint)
 * @route POST /api/v1/mobile
 * @access Public
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, caption, author, rating, image } = req.body || {};

    // Validation
    if (!name?.trim() || !caption?.trim() || !author?.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    if (!image) {
      res.status(400);
      throw new Error("Image is required");
    }

    let imageUrl = "";

    // Upload image to Cloudinary
    try {
      // Check if image is a base64 string or URL
      const isBase64 = image.startsWith("data:image");
      const isUrl = image.startsWith("http://") || image.startsWith("https://");

      if (isBase64) {
        // Upload base64 image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "books",
          resource_type: "image",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
          ],
        });
        imageUrl = uploadResponse.secure_url;
      } else if (isUrl) {
        // If it's already a URL, use it directly
        imageUrl = image;
      } else {
        res.status(400);
        throw new Error("Invalid image format. Provide base64 string or URL");
      }
    } catch (uploadError) {
      res.status(400);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // Create book with uploaded image URL
    const newBook = await Book.create({
      name: name.trim(),
      caption: caption.trim(),
      author: author.trim(),
      rating,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
