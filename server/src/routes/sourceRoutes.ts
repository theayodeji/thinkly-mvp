//Add, Delete, Exclude, Include

import express from "express";
import { addSource, deleteSource } from "../controllers/sourceController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticateJWT, addSource);

router.delete("/delete/:id", authenticateJWT, deleteSource);
// router.put("/exclude/:id", (req, res) => {});
// router.put("/include/:id", (req, res) => {});

export default router;
