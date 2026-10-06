import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";
import { UserMenu } from "./UserMenu";
import { spaceService } from "../../shared/services/spaceService";

const LandingNavbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartGuestTrial = async () => {
    try {
      setIsCreating(true);
      const newSpace = await spaceService.createSpace();
      navigate(`/spaces/${newSpace._id}`);
    } catch (error) {
      console.error("Failed to start guest trial:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b-2 border-border/50 bg-bg/80 backdrop-blur-sm h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          to="/"
          className="w-max flex items-center gap-2 scale-75 md:scale-100"
        >
          <img
            src={theme === "dark" ? "/thinkly-light.png" : "/thinkly-black.png"}
            className="h-10 md:block hidden"
            alt="Thinkly"
          />
          <img
            src={theme === "dark" ? "/brain-light.png" : "/brain-dark.png"}
            className="h-10 md:hidden block"
            alt="Thinkly"
          />
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">Go to Dashboard</Button>
            </Link>
            <ThemeToggle />
            <UserMenu onLogout={logout} />
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Button
              size="sm"
              variant="outline"
              onClick={handleStartGuestTrial}
              loading={isCreating}
              disabled={isCreating}
              className="hidden sm:inline-flex border-primary-500 text-primary-600 dark:text-primary-400 font-semibold"
            >
              Try Without Login
            </Button>
            <Link to="/auth/login">
              <Button size="sm" variant="ghost">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700 font-bold">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;
