import { SearchIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const WelcomeBanner = () => {
const { user } = useAuth();

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex-1">
        <h2 className="text-3xl font-bold">
          Welcome back, <span className="text-primary-500">{user?.name?.split(" ")[0]}</span>!
        </h2>
        <p className="text-[var(--text-secondary)]">
          Ready to dive into your studies? Here's a quick overview.
        </p>
      </div>
      <div className="">
        <label className="relative hidden lg:flex items-center w-64 rounded-md drop-shadow-lg border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:border-primary-500/40 focus-within:drop-shadow-primary-500/40">
          <SearchIcon className="inline h-5 w-5" />
          <input className="ml-2 outline-none" placeholder="Search..." />
        </label>
      </div>
    </header>
  );
};

export default WelcomeBanner;
