import express from "express";
import { addSource, deleteSource } from "../controllers/sourceController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateRequest } from "../middleware/validate.js";
import { addSourceSchema } from "../schemas/index.js";

const router = express.Router();

router.post("/add", authenticateJWT, validateRequest(addSourceSchema), catchAsync(addSource));
router.delete("/delete/:id", authenticateJWT, catchAsync(deleteSource));

export default router;
