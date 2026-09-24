import { config } from "../config/env.js";
export const setAuthTokens = (res, accessToken, refreshToken) => {
    const isProduction = config.NODE_ENV === 'production';
    const domain = config.COOKIE_DOMAIN;
    if (isProduction) {
        // Production: HTTP-only, secure cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15 minutes
            domain,
            path: '/',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain,
            path: '/',
        });
        return { accessToken: '', refreshToken: '' };
    }
    // Development: HTTP-only cookies without secure flag
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });
    // In development, return tokens in response for easier testing
    return { accessToken, refreshToken };
};
export const setAccessTokenCookie = (res, accessToken) => {
    const isProduction = config.NODE_ENV === 'production';
    const domain = config.COOKIE_DOMAIN;
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        domain: isProduction ? domain : undefined,
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/'
    });
};
export const clearAuthCookies = (res) => {
    const isProduction = config.NODE_ENV === 'production';
    const domain = config.COOKIE_DOMAIN;
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: isProduction ? domain : undefined,
        path: '/'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: isProduction ? domain : undefined,
        path: '/'
    });
};
