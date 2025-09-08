import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app/router/AppRoutes";
import "./global.css";
import { AuthProvider } from "./contexts";
import { Toaster } from "react-hot-toast"; // 👈 import here

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
          {/* 👇 Place Toaster at root so all routes can use toast() */}
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
