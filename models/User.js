import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      select: false,
    },
    profileImage: {
      type: String,
      required: false,
      trim: true,
      default:
        "https://res.cloudinary.com/drneyxkqq/image/upload/v1768087485/samples/balloons.jpg",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
