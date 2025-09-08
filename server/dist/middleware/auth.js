import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
/**
 * Middleware to authenticate JWT tokens from Authorization header
 */
export const authenticateJWT = (req, res, next) => {
    // Try to get token from Authorization header first
    let token = req.header('Authorization')?.split(' ')[1];
    // If not in header, try to get from cookies (for web clients)
    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = new Types.ObjectId(decoded.id);
        next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                isExpired: true
            });
        }
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
/**
 * Middleware to check if user is authenticated (either via JWT or OAuth)
 */
export const isAuthenticated = (req, res, next) => {
    // If user is already authenticated via OAuth
    if (req.user) {
        return next();
    }
    // Otherwise, check JWT
    return authenticateJWT(req, res, next);
};
export default {
    authenticateJWT,
    isAuthenticated
};
//# sourceMappingURL=auth.js.map