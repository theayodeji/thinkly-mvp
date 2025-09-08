export const setAuthTokens = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        // Production: HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return { accessToken: '', refreshToken: '' }; // 
    }
    // Development: Return tokens in response body
    return { accessToken, refreshToken };
};
//# sourceMappingURL=auth.js.map