import { useAuth } from "../../hooks/useAuth";

const WelcomeBanner = () => {
  const { user } = useAuth();

  return (
    <header className="mb-6">
      <h2 className="text-3xl md:text-4xl font-bold">
        Welcome, <span className="text-primary-700 dark:text-primary-400">{user?.name?.split(" ")[0] || "User"}</span>
      </h2>
    </header>
  );
};

export default WelcomeBanner;
