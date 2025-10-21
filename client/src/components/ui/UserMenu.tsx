import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Avatar } from "./Avatar";
import { useAuth } from "../../hooks/useAuth";

interface UserMenuProps {
  onLogout: () => void;
}

export const UserMenu = ({ onLogout }: UserMenuProps) => {

  const {user} = useAuth();

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center outline-none">
        <Avatar
          alt="User profile"
          size="md"
          fallback={user?.name || "User"}
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
                onClick={() => {
                  onLogout();
                  close();
                }}
              >
                <LogOut className="inline h-4" strokeWidth={1} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};
