import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";
import { Types } from "mongoose";
import { generateToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import { setAuthTokens } from "../utils/auth.js";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        const accessToken = generateToken(user._id);
        const refreshToken = generateToken(user._id, true);
        const tokens = setAuthTokens(res, accessToken, refreshToken);
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            ...tokens,
        });
    }
    catch (error) {
        console.error("Registration error:", error); // Includes stack trace
        res.status(500).json({
            message: process.env.NODE_ENV === "production"
                ? "Registration failed"
                : error.message,
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // Check if user is an OAuth user trying to use password login
        if (user.googleId && !user.password) {
            return res.status(400).json({
                success: false,
                message: "Please sign in with Google"
            });
        }
        // Verify password for non-OAuth users
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const accessToken = generateToken(user._id);
        const refreshToken = generateToken(user._id, true);
        const tokens = setAuthTokens(res, accessToken, refreshToken);
        res.json({
            user: { id: user._id, name: user.name, email: user.email },
            ...tokens,
        });
    }
    catch (error) {
        console.error("Login error:", error); // Includes stack trace
        res.status(500).json({
            message: process.env.NODE_ENV === "production" ? "Login failed" : error.message,
        });
    }
};
export const getCurrentUser = async (req, res) => {
    try {
        // req.userId is already an ObjectId from auth middleware
        const user = await UserModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Get current user error:", error); // Includes stack trace
        res.status(500).json({
            message: process.env.NODE_ENV === "production"
                ? "Failed to get current user"
                : error.message,
        });
    }
};
export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookies or body based on environment
        const refreshToken = process.env.NODE_ENV === "production"
            ? req.cookies?.refreshToken
            : req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || "refresh-secret-key");
        const newAccessToken = generateToken(new Types.ObjectId(decoded.id));
        if (process.env.NODE_ENV === "production") {
            // Set new access token as HTTP-only cookie in production
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            return res.json({});
        }
        // In development, return the new access token in the response body
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ message: error.message || "Invalid refresh token" });
    }
};
export const logout = (req, res) => {
    // Clear tokens from cookies in production
    if (process.env.NODE_ENV === "production") {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    }
    res.json({ message: "Logged out successfully" });
};
export const googleLogin = passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
});
export const googleCallback = async (req, res) => {
    try {
        // This will be called after successful Google authentication
        const userEmail = req.user?.email;
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) {
            throw new Error('No user returned from Google OAuth');
        }
        const accessToken = generateToken(user._id);
        const refreshToken = generateToken(user._id, true);
        // Set tokens based on environment
        const tokens = setAuthTokens(res, accessToken, refreshToken);
        // In production, tokens are in HTTP-only cookies
        // In development, we'll include them in the response
        const responseData = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            ...tokens, // Will be empty in production
        };
        // Redirect to frontend with success status
        const frontendUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000/oauth/callback');
        // In development, we'll pass the tokens as query params for easier testing
        if (process.env.NODE_ENV !== 'production') {
            frontendUrl.searchParams.set('access_token', accessToken);
            frontendUrl.searchParams.set('refresh_token', refreshToken);
        }
        // For production, we can use a more secure method like server-side session or HTTP-only cookies
        res.redirect(frontendUrl.toString());
    }
    catch (error) {
        console.error('Google OAuth error:', error);
        const frontendUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000/login');
        frontendUrl.searchParams.set('error', 'google_auth_failed');
        res.redirect(frontendUrl.toString());
    }
};
//# sourceMappingURL=authControllers.js.map