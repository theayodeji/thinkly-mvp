import { useRoutes, Navigate } from "react-router-dom";
import { routeConfig } from "./config";
import type { RouteConfig } from "../../shared/types/route";
import { useAuth } from "../../hooks/useAuth";

const AppRouter = () => {
  const { user } = useAuth();

  const wrapRoutes = (routes: RouteConfig[]): RouteConfig[] =>
    routes.map((r) => {
      if (r.children) {
        return {
          ...r,
          children: wrapRoutes(r.children),
        };
      }
      return {
        ...r,
        element:
          r.protected && !user ? <Navigate to="/auth/login" /> : r.element,
      };
    });

  return useRoutes(wrapRoutes(routeConfig));
};

export function AppRoutes() {
  const { loading } = useAuth();

  return !loading && <AppRouter />;
}
