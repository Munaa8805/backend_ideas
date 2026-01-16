import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: 3,
      maxlength: 50,
      unique: true,
      lowercase: true,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Category description is required"],
      minlength: 3,
      maxlength: 200,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      default:
        "https://res.cloudinary.com/drneyxkqq/image/upload/v1768087485/samples/balloons.jpg",
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
