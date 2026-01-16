import Category from "../models/Category.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { Readable } from "stream";
import cloudinary from "../utils/cloudinary.js";

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) {
    res.status(404);
    throw new Error("Categories not found");
  }
  res
    .status(200)
    .json({ message: "Categories fetched successfully", data: categories });
});

export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res
    .status(200)
    .json({ message: "Category fetched successfully", data: category });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  if (!name?.trim() || !description?.trim()) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const category = await Category.create({ name, description });
  res
    .status(201)
    .json({ message: "Category created successfully", data: category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  category.name = name?.trim().length > 3 ? name?.trim() : category.name;
  category.description =
    description?.trim().length > 3 ? description?.trim() : category.description;

  const newCategory = await category.save();
  res
    .status(200)
    .json({ message: "Category updated successfully", data: newCategory });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res
    .status(200)
    .json({ message: "Category deleted successfully", data: null });
});

export const uploadCategoryImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  if (!req.files || !req.files.file) {
    res.status(400);
    throw new Error("No image file provided");
  }
  //   console.log("image", req.files.file);
  const image = req.files.file;
  if (!image.mimetype.startsWith("image/")) {
    res.status(400);
    throw new Error("Only image files are allowed");
  }
  if (image.size > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error("File size must be less than 5MB");
  }

  try {
    // Upload to Cloudinary using upload_stream for better performance
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "categories",
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
      bufferStream.push(image.data);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });

    // Update book with new image URL
    category.image = uploadResult.secure_url;
    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      data: updatedCategory,
    });
  } catch (uploadError) {
    console.log("uploadError", uploadError);
    res.status(400);
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }
});
