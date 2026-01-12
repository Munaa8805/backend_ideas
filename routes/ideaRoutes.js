import express from "express";
import mongoose from "mongoose";
import Idea from "../models/Idea.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

//@query /api/v1/ideas
router.get("/", async (req, res, next) => {
  try {
    const limit = req.query._limit ? parseInt(req.query._limit) : 10;
    if (isNaN(limit)) {
      res.status(400);
      throw new Error("Invalid limit");
    }

    const query = Idea.find().sort({ createdAt: -1 }).limit(limit);

    const ideas = await query.exec();
    res
      .status(200)
      .json({ message: "Ideas fetched successfully", data: ideas });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid idea ID");
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    res.status(200).json({ message: "Idea fetched successfully", data: idea });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const newIdea = await Idea.create({
      title,
      summary,
      description,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
      user: req.user._id,
    });

    const savedIdea = await newIdea.save();
    res
      .status(201)
      .json({ message: "Idea created successfully", data: savedIdea });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, summary, description, tags } = req.body;

    const oldIdea = await Idea.findById(id);
    if (!oldIdea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    if (oldIdea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this idea");
    }

    oldIdea.title = title || oldIdea.title;
    oldIdea.summary = summary || oldIdea.summary;
    oldIdea.description = description || oldIdea.description;
    oldIdea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : oldIdea.tags;
    const updatedIdea = await oldIdea.save();

    res
      .status(200)
      .json({ message: "Idea updated successfully", data: updatedIdea });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    //   if (!mongoose.Types.ObjectId.isValid(id)) {
    //     res.status(400);
    //     throw new Error("Invalid idea ID");
    //   }

    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this idea");
    }
    await idea.deleteOne();

    res.status(200).json({ message: "Idea deleted successfully", data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
