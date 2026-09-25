import { Flame, Trophy, FileText, Search, Grip, LucideShare2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";
import { useDisclosure } from "../../hooks/utils/useDisclosure";
import { UserMenu } from "./UserMenu";
import { AchievementsModal } from "./AchievementsModal";
import { useSpace, useSpaceSources } from "../../hooks/queries/useSpaces";
import { BackNavigator } from "./BackNavigator";
import QuizDrawer from "./Drawer";
import SourcesAside from "../space/SourcesSection";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const { isOpen, open, close } = useDisclosure(false);
  const location = useLocation();

  const spaceMatch = location.pathname.match(/^\/spaces\/([a-f0-9]+)$/i);
  const spaceId = spaceMatch ? spaceMatch[1] : null;
  const { data: currentSpace } = useSpace(spaceId || "");
  const { data: sources } = useSpaceSources(spaceId || "");

  const isSpaceDetail = !!spaceId;
  const sourcesCount = sources?.length || 0;

  return (
    <>
      <header className={`sticky top-0 z-50 flex items-center h-20 transition-all ${
        isSpaceDetail ? 'bg-bg border-b-2 border-border/50' : 'border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm'
      }`}>
        <div className={`w-full px-6 flex items-center justify-between`}>
          {/* Left Side: Space Header OR Spacer */}
          {isSpaceDetail ? (
            <div className="flex items-center gap-4">
              <BackNavigator label="" className="p-2 text-text" />
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold text-text truncate max-w-lg">
                  {currentSpace?.title || "Untitled Space"}
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
            {isSpaceDetail && (
              <>
                <Button size="icon" variant="ghost" className="hidden md:flex">
                  <Search className="h-5 w-5 text-text-secondary" />
                </Button>
                <Button size="icon" variant="neutral" className="p-1.5 bg-neutral-200 dark:bg-neutral-800 border-none text-text">
                  <Grip className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="neutral" className="p-1.5 bg-neutral-200 dark:bg-neutral-800 border-none text-text">
                  <LucideShare2 className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {user ? (
              <>
                {!isSpaceDetail && (
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
