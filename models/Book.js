import mongoose from "mongoose";
import User from "./User.js";

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      trim: true,
      min: 1,
      max: 5,
    },

    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/drneyxkqq/image/upload/v1768087485/samples/balloons.jpg",
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    publishedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
