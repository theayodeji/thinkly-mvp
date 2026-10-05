import express from "express";
import {
  getSpaces,
  getSpace,
  createSpace,
  deleteSpace,
  updateSpace,
  chat,
  getChatHistory,
} from "../controllers/spaceController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { checkSpaceCreationLimit } from "../middleware/usageLimit.js";
import { updateSpaceSchema, chatSchema, paramsIdSchema } from "@thinkly/shared";

import { aiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", authenticateJWT, getSpaces);
router.get("/:id", authenticateJWT, validateRequest(paramsIdSchema), getSpace);
router.get("/:id/chat", authenticateJWT, validateRequest(paramsIdSchema), getChatHistory);
router.post("/create", authenticateJWT, checkSpaceCreationLimit, createSpace);
router.post("/chat", authenticateJWT, aiLimiter, validateRequest(chatSchema), chat);
router.delete("/delete/:id", authenticateJWT, validateRequest(paramsIdSchema), deleteSpace);
router.put("/rename/:id", authenticateJWT, validateRequest(updateSpaceSchema), updateSpace);

export default router;
