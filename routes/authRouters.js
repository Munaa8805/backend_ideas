import express from "express";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../utils/getJWTSecret.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    // console.log(name, email, password);
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (password.length < 3) {
      res.status(400);
      throw new Error("Password must be at least 3 characters long");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, "1h");
    const refreshToken = await generateToken(payload, "30d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ message: "User created successfully", accessToken, data: user });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    // console.log(email, password);
    if (!email.trim() || !password.trim()) {
      res.status(400);
      throw new Error("All fields are required");
    }
    if (password.length < 3) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
    // console.log("user", user);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    const payload = { userId: user._id.toString() };
    const accessToken = await generateToken(payload, "1h");
    const refreshToken = await generateToken(payload, "30d");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("No refresh token found");
    }
    const { payload } = await jwtVerify(refreshToken, JWT_SECRET);

    const user = await User.findById(payload.userId);
    console.log(user);
    if (!user) {
      res.status(401);
      throw new Error("No user found");
    }
    const newAccessToken = await generateToken(
      { userId: user._id.toString() },
      "1h"
    );

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      data: user,
    });
  } catch (error) {
    res.status(401);
    next(error);
  }
});
export default router;
