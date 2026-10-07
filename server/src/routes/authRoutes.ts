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
  forgotPassword,
  resetPassword,
  sendOTPHandler,
  verifyOTPHandler,
  changePasswordHandler,
  resendVerificationHandler,
  verifyEmailHandler,
  verifyResetTokenHandler,
} from "../controllers/authController.js";
import { authenticateJWT, optionalJWT } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateRequest } from "../middleware/validate.js";
import {
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  registerWithOtpSchema,
  resetPasswordWithOtpSchema,
  verifyEmailTokenSchema,
} from "@thinkly/shared";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// OTP operations
router.post("/send-otp", authLimiter, validateRequest(sendOtpSchema), sendOTPHandler);
router.post("/verify-otp", authLimiter, validateRequest(verifyOtpSchema), verifyOTPHandler);

// Link Verification operations
router.post("/resend-verification", authLimiter, optionalJWT, resendVerificationHandler);
router.post("/verify-email", authLimiter, validateRequest(verifyEmailTokenSchema), verifyEmailHandler);
router.post("/verify-reset-token", authLimiter, verifyResetTokenHandler);

// Regular email/password auth
router.post("/register", authLimiter, validateRequest(registerWithOtpSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/change-password", authenticateJWT, changePasswordHandler);

router.post("/logout", logout);
router.get("/me", authenticateJWT, checkAuth);
router.post("/refresh-token", refreshToken);

// Google OAuth routes
router.get(
  "/google",
  (req, res, next) => {
    const { redirect } = req.query;
    const state = redirect ? Buffer.from(JSON.stringify({ redirect })).toString("base64") : undefined;

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
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=google_auth_failed" }),
  catchAsync(googleCallback)
);

export default router;
