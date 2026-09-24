import passport from "../config/passport.js";
import { setAuthTokens, setAccessTokenCookie, clearAuthCookies } from "../utils/auth.js";
import { config } from "../config/env.js";
import { catchAsync } from "../utils/catchAsync.js";
import { registerUser, loginUser } from "../services/identity/auth/credentials.js";
import { verifyUserAuth, refreshUserToken } from "../services/identity/auth/session.js";
import { handleGoogleCallback } from "../services/identity/auth/oauth.js";
export const register = catchAsync(async (req, res, next) => {
    const result = await registerUser(req.body);
    const tokens = setAuthTokens(res, result.accessToken, result.refreshToken);
    res.json({
        user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            streaks: result.user.streaks,
            badges: result.user.badges,
        },
        ...tokens,
    });
});
export const login = catchAsync(async (req, res, next) => {
    const result = await loginUser(req.body);
    const tokens = setAuthTokens(res, result.accessToken, result.refreshToken);
    res.status(200).json({
        user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            streaks: result.user.streaks,
            badges: result.user.badges,
        },
        ...tokens,
    });
});
export const checkAuth = catchAsync(async (req, res, next) => {
    const updatedUser = await verifyUserAuth(req.userId);
    res.status(200).json(updatedUser);
});
export const refreshToken = catchAsync(async (req, res, next) => {
    const newAccessToken = await refreshUserToken(req.cookies?.refreshToken);
    setAccessTokenCookie(res, newAccessToken);
    return res.json({});
});
export const logout = catchAsync(async (req, res, next) => {
    clearAuthCookies(res);
    return res.status(200).json({ message: "Logged out successfully" });
});
export const googleLogin = passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    failureRedirect: `${config.FRONTEND_URL}/login?error=google_auth_failed`,
});
export const googleCallback = async (req, res) => {
    try {
        const tokens = await handleGoogleCallback(req.user);
        setAuthTokens(res, tokens.accessToken, tokens.refreshToken);
        const frontendUrl = new URL(config.FRONTEND_URL + "/oauth/callback");
        res.redirect(frontendUrl.toString());
    }
    catch (error) {
        console.error("Google OAuth error:", error);
        const frontendUrl = new URL(config.FRONTEND_URL + "/auth/login");
        frontendUrl.searchParams.set("error", "google_auth_failed");
        res.redirect(frontendUrl.toString());
    }
};
