import jwt from "jsonwebtoken";
import { Types } from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret-key";
export const generateToken = (id, isRefresh = false) => {
    const idString = typeof id === "string" ? id : id.toString();
    return jwt.sign({ id: idString }, isRefresh ? REFRESH_SECRET : JWT_SECRET, {
        expiresIn: isRefresh ? "7d" : "15m",
    });
};
export const verifyToken = (token, isRefresh = false) => {
    return jwt.verify(token, isRefresh ? REFRESH_SECRET : JWT_SECRET);
};
//# sourceMappingURL=jwt.js.map