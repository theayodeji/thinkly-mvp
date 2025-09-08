import express from "express";
import passport from "../config/passport.js";
import { register, login, logout, getCurrentUser, refreshToken, googleLogin, googleCallback, } from "../controllers/authControllers.js";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();
// Regular email/password auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getCurrentUser);
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
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('Authentication failed');
            return next(error);
        }
        req.user = user;
        next();
    })(req, res, next);
}, googleCallback);
export default router;
//# sourceMappingURL=authRoutes.js.map