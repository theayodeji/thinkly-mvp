import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Bell, Flame, LogOut, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b-2 border-neutral-100 bg-white/80 backdrop-blur-sm">
      <div className="wrapper sm:px-6 lg:px-0 flex items-center justify-between">
        <Link to="/" className="w-max flex items-center gap-2">
          <img
            src="/thinkly-black.png"
            className="h-10 md:block hidden"
            alt=""
          />
          <img src="/brain-dark.png" className="h-10 md:hidden block" alt="" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex text-gray-500">
            <Trophy className="h-5 w-5" />
            <span className="text-sm">12</span>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
              <Flame className="h-5 w-5" />
              <span className="text-sm">5 days</span>
            </div>
          </div>
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <Bell className="h-6 w-6" />
          </button>
          <Popover>
            <PopoverButton>
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center cursor-pointer"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBs_oJFtY8uY-A8JqmXNzbtB5SCCqqMyqR9OmN1f6_V01tqlSMMSFsUT7E2W1RAyxJD1uCI31KNxtLDOkU4WMmqZrHn0aCuLmp8n4-h0IkFLIZlmQKa4bDd4YasmuztYsnXOF1_mkdpZwb-mFCoVn-o4TM6a5cztHjtoX99BFJrz4sfOkCF_O_y2LpgQdTghcGfpHD44ok_otx_FvB4GdorX07kDUDouuP9Zsclc6-4TZ58RxMIEp9Dh9P6uaQEKbhMvm3Irw1UMFs')",
                }}
              ></div>
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
                className="w-48 absolute z-10 bg-white/60 backdrop-blur-sm shadow-xl drop-shadow-lg rounded-md"
                anchor={"bottom end"}
              >
                <div className="flex flex-col items-stretch justify-stretch cursor-pointer">
                  <Link
                    to="/notes"
                    className="p-3 hover:bg-neutral/50 color-transition"
                  >
                    Notes
                  </Link>
                  <Link
                    to="/preferences"
                    className="p-3 hover:bg-neutral/50 color-transition"
                  >
                    Preferences
                  </Link>
                  <Link
                    to="/account-settings"
                    className="p-3 hover:bg-neutral/50 color-transition"
                  >
                    Account Settings
                  </Link>
                  <button
                    className="text-red-800 p-3 hover:bg-red-500/30 flex items-center gap-2 text-red cursor-pointer color-transition"
                    onClick={() => logout()}
                  >
                    <LogOut className="inline h-4" strokeWidth={1} />
                    <span>Logout</span>
                  </button>
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
