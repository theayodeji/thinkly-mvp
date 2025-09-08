import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret-key";

export const generateToken = (
  id: Types.ObjectId | string,
  isRefresh = false
): string => {
  const idString = typeof id === "string" ? id : id.toString();
  return jwt.sign({ id: idString }, isRefresh ? REFRESH_SECRET : JWT_SECRET, {
    expiresIn: isRefresh ? "7d" : "15m",
  });
};

export const verifyToken = (
  token: string,
  isRefresh = false
): { id: string } => {
  return jwt.verify(token, isRefresh ? REFRESH_SECRET : JWT_SECRET) as {
    id: string;
  };
};
