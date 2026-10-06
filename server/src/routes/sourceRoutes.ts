import express from "express";
import { addSource, deleteSource, getSources } from "../controllers/sourceController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { addSourceSchema, paramsIdSchema, paramsSpaceIdSchema } from "@thinkly/shared";

import { allowGuestOrAuth, restrictGuestAccess } from "../middleware/guest.js";

const router = express.Router();

router.get("/:spaceId", allowGuestOrAuth, validateRequest(paramsSpaceIdSchema), getSources);

import { upload } from "../middleware/upload.js";

router.post(
  "/add",
  allowGuestOrAuth,
  upload.single("file"),
  validateRequest(addSourceSchema),
  addSource,
);
router.delete("/delete/:id", authenticateJWT, restrictGuestAccess, validateRequest(paramsIdSchema), deleteSource);

export default router;
