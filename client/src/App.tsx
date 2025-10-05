import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/router/AppRoutes";
import "./global.css";
import { AuthProvider, ThemeProvider } from "./contexts";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div className="app min-h-screen bg-background text-foreground">
              <AppRoutes />
              <Toaster position="top-right" />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
