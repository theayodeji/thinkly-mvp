import express from "express";
import passport from "../config/passport.js";
import {
  register,
  login,
  logout,
  checkAuth,
  refreshToken,
  googleLogin,
  googleCallback,
} from "../controllers/authController.js";
import { authenticateJWT, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Regular email/password auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, checkAuth);
router.post("/refresh-token", refreshToken);

// Google OAuth routes
router.get(
  "/google",
  (req, res, next) => {
    const { redirect } = req.query;
    const state = redirect ? Buffer.from(JSON.stringify({ redirect })).toString('base64') : undefined;
    
    const authenticator = passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
      session: false,
    });
    
    authenticator(req, res, next);
  },
  googleLogin
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err: any, user: any, info: any) => {
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
  },
  googleCallback
);

export default router;
