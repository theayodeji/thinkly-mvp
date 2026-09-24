import express from "express";
import passport from "../config/passport.js";
import { register, login, logout, checkAuth, refreshToken, googleLogin, googleCallback, } from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateRequest } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "@thinkly/shared";
const router = express.Router();
// Regular email/password auth
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, checkAuth);
router.post("/refresh-token", refreshToken);
// Google OAuth routes
router.get("/google", (req, res, next) => {
    const { redirect } = req.query;
    const state = redirect ? Buffer.from(JSON.stringify({ redirect })).toString('base64') : undefined;
    const authenticator = passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
        session: false,
    });
    authenticator(req, res, next);
}, googleLogin);
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: '/login?error=google_auth_failed' }), catchAsync(googleCallback));
export default router;
