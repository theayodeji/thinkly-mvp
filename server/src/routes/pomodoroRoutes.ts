import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { completeSession } from "../controllers/pomodoroController.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = express.Router();

// Stop a pomodoro timer
router.post("/complete", authenticateJWT, catchAsync(completeSession));

export default router;