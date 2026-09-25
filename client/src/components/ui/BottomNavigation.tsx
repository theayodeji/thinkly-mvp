import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Layers,
  BarChart2,
  Settings,
} from "lucide-react";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Spaces", path: "/spaces", icon: FileText },
    { name: "Cards", path: "/flashcards", icon: Layers },
    { name: "Stats", path: "/statistics", icon: BarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg border-t-2 border-border/50 z-50 px-2 py-2 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${
              isActive
                ? "text-primary-600 dark:text-primary-400 font-bold"
                : "text-text-secondary hover:text-text"
            }`}
          >
            <item.icon className={`h-6 w-6 mb-1 ${isActive ? "fill-primary-100 dark:fill-primary-900/30" : ""}`} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
