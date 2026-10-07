import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/router/AppRoutes";
import "./global.css";
import { AuthProvider, ThemeProvider } from "./contexts";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

import { AuthPromptModal } from "./components/auth/AuthPromptModal";
import { UpgradeModal } from "./components/billing/UpgradeModal";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <div className="app min-h-screen bg-background text-foreground">
              <AppRoutes />
              <AuthPromptModal />
              <UpgradeModal />
              <Toaster
                position="top-right"
                gutter={10}
                toastOptions={{
                  duration: 3500,
                  success: {
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "#ffffff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#ffffff",
                    },
                  },
                }}
              />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
