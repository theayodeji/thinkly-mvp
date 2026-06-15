import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
  chat,
} from "../controllers/noteController.js";
import { authenticateJWT } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateRequest } from "../middleware/validate.js";
import { updateNoteSchema, chatSchema } from "../schemas/index.js";

const router = express.Router();

router.get("/", authenticateJWT, catchAsync(getNotes));
router.get("/:id", authenticateJWT, catchAsync(getNote));
router.post("/create", authenticateJWT, catchAsync(createNote));
router.post("/chat", authenticateJWT, validateRequest(chatSchema), catchAsync(chat));
router.delete("/delete/:id", authenticateJWT, catchAsync(deleteNote));
router.put("/rename/:id", authenticateJWT, validateRequest(updateNoteSchema), catchAsync(updateNote));

export default router;