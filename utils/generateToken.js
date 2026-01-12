import { SignJWT } from "jose";
import { JWT_SECRET } from "./getJWTSecret.js";

const generateToken = async (payload, expiresIn = "30d") => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export default generateToken;
