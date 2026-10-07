import express from "express";
import { subscribeToEvents } from "../controllers/eventController.js";
import { allowGuestOrAuth } from "../middleware/guest.js";

const router = express.Router();

router.get("/subscribe", allowGuestOrAuth, subscribeToEvents);

export default router;
