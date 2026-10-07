import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Home,
  FileText,
  Layers,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";
import { useCreateSpace, useSpaces } from "../../hooks/queries/useSpaces";
import { usePermissionsAndLimits, MeteredMetric } from "../../hooks/usePermissionsAndLimits";

export const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: createSpace } = useCreateSpace();
  const { data: recentSpacesData } = useSpaces();
  const [isCreating, setIsCreating] = useState(false);

  const { getLimitStatus, triggerLimitModal } = usePermissionsAndLimits();
  // We can't determine current spaces count exactly from here without tracking all spaces, 
  // but if the limit max is 1, and we have 1 recent space, we know we've reached it.
  const activeSpacesLimit = getLimitStatus(MeteredMetric.ACTIVE_SPACES);

  // Hide Sidebar completely for unauthenticated or guest trial users
  if (!user || user.isGuest) {
    return null;
  }

  const allSpacesCount = recentSpacesData?.length || 0;
  const isSpaceLimitReached = allSpacesCount >= activeSpacesLimit.max && activeSpacesLimit.max !== Infinity;

  // Take the 4 most recently updated Spaces
  const recentSpaces: any[] = (recentSpacesData || []).slice(0, 4);

  const handleCreateSpace = async () => {
    if (isSpaceLimitReached) {
      triggerLimitModal("You've reached your maximum limit for active study spaces.");
      return;
    }

    setIsCreating(true);
    try {
      const newSpace = await createSpace();
      navigate(`/spaces/${newSpace._id}`);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        triggerLimitModal(error.response.data.message || "Space creation limit reached.");
      } else {
        console.error("Failed to create Space:", error);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Spaces", path: "/spaces", icon: FileText },
    { name: "My Stats", path: "/statistics", icon: BarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative transition-all duration-300 ease-in-out border-r border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg text-text h-screen hidden md:flex flex-col z-[60] ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-20 border-b border-white/30 dark:border-white/5">
        {isOpen ? (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={isDark ? "/thinkly-light.png" : "/thinkly-black.png"}
              className="h-10"
              alt="Thinkly Logo"
            />
          </Link>
        ) : (
          <Link to="/dashboard">
            <img
              src={isDark ? "/brain-light.png" : "/brain-dark.png"}
              className="h-10"
              alt="Brain Icon"
            />
          </Link>
        )}
      </div>

      <div className="p-4">
        <Button
          onClick={handleCreateSpace}
          loading={isCreating}
          className={`w-full flex items-center justify-center gap-2 btn-3d-primary ${!isOpen && 'px-0 min-w-[40px]'}`}
        >
          <PlusCircle className="h-5 w-5 shrink-0" />
          {isOpen && <span>Create Space</span>}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 mt-2 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white/80 dark:bg-slate-800/80 shadow-sm text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-text-secondary hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-text"
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary-500" : ""}`} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-border/10 space-y-2">
        {import.meta.env.VITE_APP_MODE === "launch" && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("thinkly:upgrade-modal"))}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold shadow-md hover:opacity-90 transition-all text-xs ${!isOpen && 'justify-center'}`}
            title={!isOpen ? "Upgrade to PRO" : undefined}
          >
            <span className="text-base">✨</span>
            {isOpen && <span>Upgrade to PRO</span>}
          </button>
        )}
        <Link
          to="/help"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${!isOpen && 'justify-center'}`}
          title={!isOpen ? "Help" : undefined}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {isOpen && <span>Help</span>}
        </Link>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${!isOpen && 'justify-center'}`}
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={toggle}
        className="absolute -right-3 top-7 z-50 bg-white dark:bg-slate-800 border border-white/50 dark:border-white/10 rounded-full p-1 text-text-secondary hover:text-primary-600 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-colors"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
};
