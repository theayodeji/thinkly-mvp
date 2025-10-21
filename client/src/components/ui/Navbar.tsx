import { Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";
import { useState } from "react";
import { UserMenu } from "./UserMenu";
import { AchievementsModal } from "./AchievementsModal";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const [streakModalOpen, setStreakModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm">
      <div className="wrapper sm:px-6 lg:px-0 flex items-center justify-between">
        <Link
          to="/"
          className="w-max flex items-center gap-2 scale-75 md:scale-100"
        >
          <img
            src={theme === "dark" ? "/thinkly-light.png" : "/thinkly-black.png"}
            className="h-10 md:block hidden"
            alt=""
          />
          <img
            src={theme === "dark" ? "/brain-light.png" : "/brain-dark.png"}
            className="h-10 md:hidden block"
            alt=""
          />
        </Link>
        {user ? (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="hidden items-center gap-2 md:flex text-text-secondary" onClick={() => setStreakModalOpen(true)}>
              <Trophy className="h-5 w-5" />
              <span className="text-sm">{user.badges?.length > 0 ? user.badges?.length : 0}</span>
              <Flame className="h-5 w-5" />
              <span className="text-sm">{user?.streaks?.current || 0} days</span>
            </div>
              <AchievementsModal isOpen={streakModalOpen} onClose={() => setStreakModalOpen(false)} />
            <ThemeToggle />
            <UserMenu onLogout={logout} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth/login">
              <Button size="sm">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm" className="bg-dark dark:bg-neutral-300 text-white dark:text-dark">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
