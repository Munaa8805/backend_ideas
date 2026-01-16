import express from "express";
import { Readable } from "stream";
import Book from "../models/Book.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

/**
 * Create a new book with image upload to Cloudinary
 * @route POST /api/v1/books
 * @access Public
 */

router.post("/mobile/create", async (req, res, next) => {
  try {
    const { name, caption, author, rating, image } = req.body;
    console.log("title", name);
    console.log("caption", caption);
    console.log("author", author);
    console.log("rating", rating);
    console.log("image", image);

    if (!image || !name || !caption || !rating) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

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
    console.log("newBook", newBook);

    //

    res.status(201).json({
      message: "Book created successfully",
      data: {},
    });
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, caption, author, rating } = req.body || {};

    // Validation
    if (!name?.trim() || !caption?.trim() || !author?.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    // Create book with uploaded image URL or default
    const newBook = await Book.create({
      name,
      caption,
      author,
      rating,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all books
 * @route GET /api/v1/books
 * @access Public
 */
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

/**
 * Get a single book by ID
 * @route GET /api/v1/books/:id
 * @access Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    res.status(200).json({
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Upload book photo to Cloudinary
 * @route PUT /api/v1/books/:id/photo
 * @access Public
 * @param {file} file - Image file (multipart/form-data)
 */
router.put("/:id/photo", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the book
    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    // Check if file was uploaded
    if (!req.files || !req.files.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    const sampleFile = req.files.file;

    // Validate file type - must be an image
    if (!sampleFile.mimetype.startsWith("image/")) {
      res.status(400);
      throw new Error("Only image files are allowed");
    }

    // Validate file size (10MB limit)
    if (sampleFile.size > 5 * 1024 * 1024) {
      res.status(400);
      throw new Error("File size must be less than 10MB");
    }

    try {
      // Upload to Cloudinary using upload_stream for better performance
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "books",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              // console.log("error", error);
              reject(error);
            } else {
              // console.log("result", result);
              resolve(result);
            }
          }
        );

        // Create readable stream from buffer and pipe to Cloudinary
        // express-fileupload provides file data in req.files.file.data
        const bufferStream = new Readable();
        bufferStream.push(sampleFile.data);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });

      // Update book with new image URL
      book.image = uploadResult.secure_url;
      const updatedBook = await book.save();

      res.status(200).json({
        message: "Image uploaded successfully",
        data: updatedBook,
      });
    } catch (uploadError) {
      res.status(400);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }
  } catch (error) {
    next(error);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, caption, author, rating } = req.body || {};

    // Find the book
    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    // Update only provided fields
    if (name !== undefined) book.name = name.trim();
    if (caption !== undefined) book.caption = caption.trim();
    if (author !== undefined) book.author = author.trim();
    if (rating !== undefined) book.rating = rating;

    // Save the updated book
    const updatedBook = await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    // const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    const data = await books.json();
    res.status(200).json({
      message: "Books fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
