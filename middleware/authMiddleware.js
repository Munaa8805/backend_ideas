import { jwtVerify } from "jose";
import User from "../models/User.js";
import { JWT_SECRET } from "../utils/getJWTSecret.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader?.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("No token found");
    }

    console.log("authHeader", authHeader);
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id name email");
    if (!user) {
      res.status(401);
      throw new Error("No user found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
