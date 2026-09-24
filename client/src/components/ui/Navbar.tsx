import { Flame, Trophy, FileText, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";
import { useDisclosure } from "../../hooks/utils/useDisclosure";
import { UserMenu } from "./UserMenu";
import { AchievementsModal } from "./AchievementsModal";
import { useNote } from "../../hooks/queries/useNotes";
import { BackNavigator } from "./BackNavigator";
import QuizDrawer from "./Drawer";
import SourcesAside from "../note/SourcesSection";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const { isOpen, open, close } = useDisclosure(false);
  const location = useLocation();

  const noteMatch = location.pathname.match(/^\/notes\/([a-f0-9]+)$/i);
  const noteId = noteMatch ? noteMatch[1] : null;
  const { data: currentNote } = useNote(noteId || "");

  const isNoteDetail = !!noteId;
  const sourcesCount = currentNote?.sources?.length || 0;

  return (
    <>
      <header className={`sticky top-0 z-50 flex items-center h-20 transition-all ${
        isNoteDetail ? 'bg-bg border-b-2 border-border/50' : 'border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm'
      }`}>
        <div className={`w-full px-6 flex items-center justify-between`}>
          {/* Left Side: Note Header OR Spacer */}
          {isNoteDetail ? (
            <div className="flex items-center gap-4">
              <BackNavigator label="" className="p-2 text-text" />
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold text-text truncate max-w-lg">
                  {currentNote?.title || "Untitled Note"}
                </h2>
                <div className="hidden lg:flex items-center mt-1">
                  <QuizDrawer
                    trigger={
                      <button className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-xs text-text-secondary font-medium">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">{sourcesCount} sources</span>
                      </button>
                    }
                    title="Sources"
                    position="right"
                  >
                    <SourcesAside />
                  </QuizDrawer>
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}

          {/* Right Side: User Stats & Settings */}
          <div className="flex items-center gap-4 shrink-0">
            {isNoteDetail && (
              <Button size="icon" variant="ghost" className="hidden md:flex">
                <Search className="h-5 w-5 text-text-secondary" />
              </Button>
            )}
            
            {user ? (
              <>
                {!isNoteDetail && (
                  <div className="hidden items-center gap-4 md:flex bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full text-text-secondary cursor-pointer" onClick={open}>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-bold text-text">{user.badges?.length > 0 ? user.badges?.length * 50 : 0}</span>
                    </div>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-bold text-text">{user?.streaks?.current || 0} days</span>
                    </div>
                  </div>
                )}
                <AchievementsModal isOpen={isOpen} onClose={close} />
                <ThemeToggle />
                <UserMenu onLogout={logout} />
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth/login">
                  <Button size="sm">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" className="bg-dark dark:bg-neutral-300 text-white dark:text-dark">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
