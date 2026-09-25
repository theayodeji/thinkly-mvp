import express from "express";
import { addSource, deleteSource, getSources } from "../controllers/sourceController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { addSourceSchema, paramsIdSchema, paramsSpaceIdSchema } from "@thinkly/shared";

const router = express.Router();

router.get("/:spaceId", authenticateJWT, validateRequest(paramsSpaceIdSchema), getSources);

router.post(
  "/add",
  authenticateJWT,
  validateRequest(addSourceSchema),
  addSource,
);
router.delete("/delete/:id", authenticateJWT, validateRequest(paramsIdSchema), deleteSource);

export default router;
