import mongoose from "mongoose";
import { IEvent } from "../types/entities.js";

const EventSchema = new mongoose.Schema<IEvent>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

const EventModel = mongoose.model<IEvent>("Event", EventSchema);

export default EventModel;