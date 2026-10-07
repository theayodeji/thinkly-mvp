import { useEffect } from "react";
import {
  Flame,
  Trophy,
  FileText,
  ExternalLink,
} from "lucide-react";
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
import { useSpaceUIStore } from "../../store/spaceUIStore";

const Navbar = () => {
  const { logout, user, loading } = useAuth();
  const { theme } = useTheme();
  const { isOpen, open, close } = useDisclosure(false);
  const location = useLocation();
  const { isSourceDrawerOpen, setSourceDrawerOpen } = useSpaceUIStore();

  // Auto popup streak achievements modal once per day on first login or page load
  useEffect(() => {
    if (!loading && user && !user.isGuest) {
      const userId = (user as any).id || (user as any)._id || "user";
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `thinkly_streak_modal_last_shown_${userId}`;
      const lastShown = localStorage.getItem(storageKey);

      if (lastShown !== today) {
        open();
        localStorage.setItem(storageKey, today);
      }
    }
  }, [user, loading, open]);

  const spaceMatch = location.pathname.match(/^\/spaces\/([a-f0-9]+)$/i);
  const spaceId = spaceMatch ? spaceMatch[1] : null;
  const { data: currentSpace } = useSpace(spaceId || "");
  const { data: sources } = useSpaceSources(spaceId || "");

  const isSpaceDetail = !!spaceId;
  const sourcesCount = sources?.length || 0;

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center h-16 md:h-20 shrink-0 transition-all ${
          isSpaceDetail
            ? "bg-bg border-b-2 border-border/50"
            : "border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm"
        }`}
      >
        <div className={`w-full px-4 md:px-6 flex items-center justify-between`}>
          {/* Left Side: Space Header OR Spacer */}
          {isSpaceDetail ? (
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 pr-2">
              <BackNavigator
                label=""
                className="p-1 md:p-2 text-text shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-lg md:text-2xl font-bold text-text truncate">
                  {currentSpace?.title || "Untitled Space"}
                </h2>
                <div className="hidden lg:flex items-center mt-1">
                  <QuizDrawer
                    open={isSourceDrawerOpen}
                    onOpenChange={setSourceDrawerOpen}
                    trigger={
                      <button className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-xs text-text-secondary font-medium">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs flex items-center gap-2">
                          View {sourcesCount} sources
                          <ExternalLink className="h-3 w-3" />
                        </span>
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
            <div className="flex-1" />
          )}

          {/* Right Side: User Stats & Settings */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {loading ? (
              <>
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                  <div className="w-24 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                </div>
              </>
            ) : user ? (
              <>
                {!isSpaceDetail && (
                  <div
                    className="hidden items-center gap-4 md:flex bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full text-text-secondary cursor-pointer"
                    onClick={open}
                  >
                    <div className="flex items-center gap-1">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-bold text-text">
                        {user.badges?.length > 0 ? user.badges?.length * 50 : 0}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-bold text-text">
                        {user?.streaks?.current || 0} days
                      </span>
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
                  <Button
                    size="sm"
                    className="bg-dark dark:bg-neutral-300 text-white dark:text-dark"
                  >
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
