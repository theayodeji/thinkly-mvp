import express from "express";
import { authenticateJWT } from "../middleware/auth.js";
import { completeSession } from "../controllers/pomodoroController.js";

const router = express.Router();

// Stop a pomodoro timer
router.post("/complete", authenticateJWT, completeSession);

export default router;
