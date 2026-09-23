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
import { validateRequest } from "../middleware/validate.js";
import { updateNoteSchema, chatSchema } from "../schemas/index.js";

const router = express.Router();

router.get("/", authenticateJWT, getNotes);
router.get("/:id", authenticateJWT, getNote);
router.post("/create", authenticateJWT, createNote);
router.post("/chat", authenticateJWT, validateRequest(chatSchema), chat);
router.delete("/delete/:id", authenticateJWT, deleteNote);
router.put("/rename/:id", authenticateJWT, validateRequest(updateNoteSchema), updateNote);

export default router;