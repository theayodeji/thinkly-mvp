// src/lib/events/dispatcher.js
import eventBus from "./eventBus.js";
import { IUser } from "../../types/entities.js";

export type DispatchEvent = {
  type: "streak_milestone" | "quiz_completed" | "quiz_perfect_score" | "note_added" | "question_asked" | "study_session_completed";
  user: IUser;
  data: any;
};

export const dispatchEvent = (event: DispatchEvent) => {
  eventBus.emit(event.type, event.user, event.data);
};
