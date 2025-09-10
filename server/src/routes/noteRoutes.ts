//routes to create, delete, rename, and toggle include/exclude flags on notes
import express from "express";
import { getNotes, createNote, deleteNote, updateNote, getNote } from "../controllers/noteController.js";
import { authenticateJWT } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authenticateJWT, getNotes);
router.get("/:id", authenticateJWT, getNote);
router.post("/create", authenticateJWT, createNote);
router.delete("/delete/:id", authenticateJWT, deleteNote);
router.put("/rename/:id", authenticateJWT, updateNote);
// router.patch("/:id", (req, res) => {});

export default router;