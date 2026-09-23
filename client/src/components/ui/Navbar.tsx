import { Flame, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";
import { useDisclosure } from "../../hooks/utils/useDisclosure";
import { UserMenu } from "./UserMenu";
import { AchievementsModal } from "./AchievementsModal";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const { isOpen, open, close } = useDisclosure(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Notes", path: "/notes" },
    { name: "Library", path: "/flashcards" },
    { name: "Quizzes", path: "/quizzes" },
  ];

  return (
    <header className="sticky top-0 z-10 border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm h-20 flex items-center">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left Side: Secondary Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-text-secondary font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`pb-1 transition-colors ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
                    : "hover:text-text"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: User Stats & Settings */}
        {user ? (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="hidden items-center gap-4 md:flex bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full text-text-secondary" onClick={open}>
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
            <AchievementsModal isOpen={isOpen} onClose={close} />
            <ThemeToggle />
            <UserMenu onLogout={logout} />
          </div>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
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
