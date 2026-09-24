import express from "express";
import { addSource, deleteSource } from "../controllers/sourceController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { addSourceSchema, paramsIdSchema } from "@thinkly/shared";

const router = express.Router();

router.post(
  "/add",
  authenticateJWT,
  validateRequest(addSourceSchema),
  addSource,
);
router.delete("/delete/:id", authenticateJWT, validateRequest(paramsIdSchema), deleteSource);

export default router;
