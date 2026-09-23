import React from "react";
import { createRoot } from "react-dom/client";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(
  <QueryClientProvider client={queryClient}>
    <PomodoroProvider>
      <App />
    </PomodoroProvider>
  </QueryClientProvider>
);
