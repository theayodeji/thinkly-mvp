import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config/env.js";
import GuestSession from "../models/GuestSession.js";
import { AppError } from "../utils/AppError.js";

const JWT_SECRET = config.JWT_SECRET;

export type GuestAction = "create_space" | "chat" | "generate_learning_path" | "generate_flashcards";

export const GUEST_LIMITS = {
  maxSpaces: 1,
  maxMessages: 10,
  maxLearningPaths: 1,
  maxFlashcards: 10,
  maxUploadSizeBytes: 5 * 1024 * 1024, // 5 MB light material limit
};

/**
 * Middleware that allows either an authenticated user OR a guest user with a guest device ID.
 */
export const allowGuestOrAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || (req.query.token as string) || "";

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: Types.ObjectId };
      req.userId = String(decoded.id);
      req.isGuest = false;
      return next();
    } catch (error) {
      // Invalid or expired token -> fall through to guest check
    }
  }

  // Extract guest device ID from custom header, cookie, or query string
  const guestDeviceId =
    (req.headers["x-guest-device-id"] as string) ||
    req.cookies.guestDeviceId ||
    (req.query.guestDeviceId as string) ||
    "";

  if (!guestDeviceId) {
    return res.status(401).json({
      success: false,
      code: "GUEST_AUTH_REQUIRED",
      error: "Authentication or guest device session required.",
    });
  }

  // Create a 24-character hex string from guestDeviceId to pass Mongoose ObjectId validation
  const cleanId = guestDeviceId.replace(/[^a-f0-9]/gi, "").padEnd(24, "0").slice(0, 24);
  const guestObjectId = new Types.ObjectId(cleanId).toString();

  req.isGuest = true;
  req.guestDeviceId = guestDeviceId;
  req.userId = guestObjectId;
  next();
};

/**
 * Middleware that checks and enforces strict limits for guest trial users.
 */
export const checkGuestLimit = (action: GuestAction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.isGuest) {
        // Logged-in authenticated users bypass guest checks
        return next();
      }

      const deviceId = req.guestDeviceId;
      if (!deviceId) {
        return res.status(401).json({
          success: false,
          code: "GUEST_AUTH_REQUIRED",
          error: "Please sign in or create a free account to continue.",
        });
      }

      // Find or create GuestSession document
      let guestSession = await GuestSession.findOne({ deviceId });
      if (!guestSession) {
        guestSession = await GuestSession.create({ deviceId });
      }

      switch (action) {
        case "create_space": {
          if (guestSession.spacesCount >= GUEST_LIMITS.maxSpaces) {
            return res.status(403).json({
              success: false,
              code: "GUEST_LIMIT_REACHED",
              error: "Guest trial limit reached: You can create 1 study space. Sign in or register to create more!",
              limitType: "spaces",
            });
          }
          guestSession.spacesCount += 1;
          break;
        }

        case "chat": {
          if (guestSession.messagesCount >= GUEST_LIMITS.maxMessages) {
            return res.status(403).json({
              success: false,
              code: "GUEST_LIMIT_REACHED",
              error: "Guest trial limit reached: 10 messages sent. Sign in or register to keep chatting!",
              limitType: "messages",
            });
          }
          guestSession.messagesCount += 1;
          break;
        }

        case "generate_learning_path": {
          if (guestSession.learningPathsCount >= GUEST_LIMITS.maxLearningPaths) {
            return res.status(403).json({
              success: false,
              code: "GUEST_LIMIT_REACHED",
              error: "Guest trial limit reached: 1 learning path generated. Sign in or register for unlimited paths!",
              limitType: "learning_paths",
            });
          }
          guestSession.learningPathsCount += 1;
          break;
        }

        case "generate_flashcards": {
          const requestedCount = req.body?.count || 10;
          if (guestSession.flashcardsCount >= GUEST_LIMITS.maxFlashcards || requestedCount > 10) {
            return res.status(403).json({
              success: false,
              code: "GUEST_LIMIT_REACHED",
              error: "Guest trial limit reached: Maximum 10 flashcards permitted. Sign in or register to generate more!",
              limitType: "flashcards",
            });
          }
          guestSession.flashcardsCount += requestedCount;
          break;
        }

        default:
          return res.status(403).json({
            success: false,
            code: "GUEST_AUTH_REQUIRED",
            error: "This feature requires a free account. Please sign in or register!",
          });
      }

      await guestSession.save();
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware that strictly blocks guests from non-public features (e.g., audio generation, quizzes, user settings).
 */
export const restrictGuestAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.isGuest) {
    return res.status(403).json({
      success: false,
      code: "GUEST_AUTH_REQUIRED",
      error: "This feature is locked for guest users. Please sign in or create an account to unlock!",
    });
  }
  next();
};
