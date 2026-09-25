import { routes } from "./routes";
import type { RouteConfig } from "../../shared/types/route";

// layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LandingLayout from "../layouts/LandingLayout";

// pages
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Dashboard from "../../pages/Dashboard";
import SpacesList from "../../pages/SpacesList";
import SpaceDetail from "../../pages/SpaceDetail";
import Home from "../../pages/Home";
import InDevelopment from "../../pages/InDevelopment";

export const routeConfig: RouteConfig[] = [
  {
    element: <LandingLayout />,
    children: [
      { path: routes.home, element: <Home />, protected: false },
      { path: routes.inDevelopment, element: <InDevelopment />, protected: false },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: routes.dashboard, element: <Dashboard />, protected: true, },
      { path: routes.Spaces.root, element: <SpacesList />, protected: true },
      {
        path: routes.Spaces.Space(":id"),
        element: <SpaceDetail />,
        protected: true,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: routes.auth.login, element: <Login />, protected: false },
      { path: routes.auth.register, element: <Register />, protected: false },
    ],
  },
];
