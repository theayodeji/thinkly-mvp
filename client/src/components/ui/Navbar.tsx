import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  // useClose,
} from "@headlessui/react";
import { Bell, Flame, LogOut, Trophy } from "lucide-react";
import { Avatar } from "./Avatar";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./Button";

const Navbar = () => {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  // const close = useClose();

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
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex text-text-secondary">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">12</span>
              <Flame className="h-5 w-5" />
              <span className="text-sm">5 days</span>
            </div>
            <ThemeToggle />
            <button className="relative rounded-full p-2 text-text-secondary hover:bg-bg-secondary">
              <Bell className="h-6 w-6" />
            </button>
            <Popover>
              <PopoverButton className="flex items-center outline-none">
                <Avatar
                  alt="User profile"
                  size="md"
                  fallback="User"
                  className="border-2 cursor-pointer border-secondary hover:border-primary-400 transition-colors bg-secondary-500/50 dark:bg-secondary-500/50"
                />
              </PopoverButton>
              <Transition
                enter="transition ease-out duration-100"
                leave="transition ease-in duration-75"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <PopoverPanel
                  className="w-48 absolute z-10 bg-bg-secondary/80 dark:bg-dark backdrop-blur-sm shadow-xl drop-shadow-lg rounded-md border border-border dark:border-neutral/40"
                  anchor={"bottom end"}
                >
                  {({ close }) => (
                    <div className="flex flex-col items-stretch justify-stretch cursor-pointer">
                      <Link
                        to="/dashboard"
                        className="p-3 hover:bg-neutral/70 color-transition dark:text-white text-black"
                        onClick={() => close()}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/notes"
                        className="p-3 hover:bg-neutral/70 color-transition dark:text-white text-black"
                        onClick={() => close()}
                      >
                        Notes
                      </Link>
                      <Link
                        to="/preferences"
                        className="p-3 hover:bg-neutral/70 color-transition dark:text-white text-black"
                        onClick={() => close()}
                      >
                        Preferences
                      </Link>
                      <Link
                        to="/profile"
                        className="p-3 hover:bg-neutral/70 color-transition dark:text-white text-black"
                        onClick={() => close()}
                      >
                        Profile
                      </Link>
                      <button
                        className="text-red-800 p-3 hover:bg-red-500/30 dark:text-red-500 flex items-center gap-2 text-red cursor-pointer color-transition"
                        onClick={() => logout()}
                      >
                        <LogOut className="inline h-4" strokeWidth={1} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </PopoverPanel>
              </Transition>
            </Popover>
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
