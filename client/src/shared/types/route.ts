// types/routes.ts
import { ReactNode } from "react";

export type RouteConfig = {
  path?: string;
  element: ReactNode;
  protected?: boolean;
  children?: RouteConfig[];
};
