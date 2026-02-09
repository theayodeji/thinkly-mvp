import React from "react";
import { createRoot } from "react-dom/client";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(
  <PomodoroProvider>
    <App />
  </PomodoroProvider>
);
