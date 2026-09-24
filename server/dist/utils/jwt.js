import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
const JWT_SECRET = config.JWT_SECRET;
const REFRESH_SECRET = config.REFRESH_SECRET;
export const generateToken = (id, isRefresh = false) => {
    const idString = typeof id === "string" ? id : id.toString();
    return jwt.sign({ id: idString }, isRefresh ? REFRESH_SECRET : JWT_SECRET, {
        expiresIn: isRefresh ? "7d" : "15m",
    });
};
export const verifyToken = (token, isRefresh = false) => {
    return jwt.verify(token, isRefresh ? REFRESH_SECRET : JWT_SECRET);
};
