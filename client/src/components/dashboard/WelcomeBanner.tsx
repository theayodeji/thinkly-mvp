import { SearchIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const WelcomeBanner = () => {
const { user } = useAuth();

  return (
    <header className="flex items-center justify-between my-8">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-bold">
          Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">{user?.name?.split(" ")[0]}</span>!
        </h2>
        <p className="text-[var(--text-secondary)]">
          Ready to dive into your studies? Here's a quick overview.
        </p>
      </div>
    </header>
  );
};

export default WelcomeBanner;
