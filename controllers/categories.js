import Category from "../models/Category.js";
import asyncHandler from "../middleware/asyncHandler.js";

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
