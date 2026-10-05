import express from "express";
import { updatePreferences } from "../controllers/userController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

router.put("/preferences", authenticateJWT, catchAsync(updatePreferences));

export default router;
