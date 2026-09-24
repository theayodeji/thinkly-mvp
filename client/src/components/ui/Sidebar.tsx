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
import { useCreateNote, useNotes } from "../../hooks/queries/useNotes";

export const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: createNote } = useCreateNote();
  const { data: recentNotesData } = useNotes();
  const [isCreating, setIsCreating] = useState(false);

  // Take the 5 most recently updated notes
  const recentNotes: any[] = (recentNotesData || []).slice(0, 5);

  const handleCreateNote = async () => {
    setIsCreating(true);
    try {
      const newNote = await createNote();
      navigate(`/notes/${newNote._id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "My Notes", path: "/notes", icon: FileText },
    { name: "My Stats", path: "/statistics", icon: BarChart2 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative transition-all duration-300 ease-in-out border-r-2 border-border/50 bg-bg text-text h-screen hidden md:flex flex-col ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-20 border-b-2 border-border/10">
        {isOpen ? (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={theme === "dark" ? "/thinkly-light.png" : "/thinkly-black.png"}
              className="h-10"
              alt="Thinkly Logo"
            />
          </Link>
        ) : (
          <Link to="/dashboard">
            <img
              src={theme === "dark" ? "/brain-light.png" : "/brain-dark.png"}
              className="h-10"
              alt="Brain Icon"
            />
          </Link>
        )}
      </div>

      <div className="p-4">
        <Button
          onClick={handleCreateNote}
          loading={isCreating}
          className={`w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white border-none ${!isOpen && 'px-0'}`}
        >
          <PlusCircle className="h-5 w-5" />
          {isOpen && <span>Create Note</span>}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2 mt-2 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                  : "text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800"
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="font-semibold">{item.name}</span>}
            </Link>
          );
        })}

        {isOpen && recentNotes.length > 0 && (
          <div className="mt-8 mb-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Recent</span>
            </div>
            <div className="space-y-1">
              {recentNotes.map((note: any) => {
                const isActive = location.pathname === `/notes/${note._id}`;
                return (
                  <Link
                    key={note._id}
                    to={`/notes/${note._id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium" 
                        : "text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{note.title || "Untitled Note"}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t-2 border-border/10 space-y-2">
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
        className="absolute -right-3 top-24 bg-bg border-2 border-border rounded-full p-1 text-text-secondary hover:text-primary-600 shadow-md"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </aside>
  );
};
