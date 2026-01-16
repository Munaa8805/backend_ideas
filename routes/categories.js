import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/categories.js";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .put(updateCategory)
  .delete(deleteCategory)
  .get(getCategoryById);

export default router;
