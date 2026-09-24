import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { config } from "../config/env.js";

const JWT_SECRET = config.JWT_SECRET;

/**
 * Middleware to authenticate JWT tokens from Authorization header
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.cookies.accessToken || "";

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: Types.ObjectId };
    req.userId = String(decoded.id);
    next();
  } catch (error) {
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
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  return authenticateJWT(req, res, next);
};

export default {
  authenticateJWT,
  isAuthenticated
};
