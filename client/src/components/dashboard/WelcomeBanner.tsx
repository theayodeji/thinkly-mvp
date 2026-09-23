import { useAuth } from "../../hooks/useAuth";

const WelcomeBanner = () => {
  const { user } = useAuth();

  return (
    <header className="mb-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome back, <span className="text-primary-700 dark:text-primary-400">{user?.name?.split(" ")[0] || "User"}</span>!
      </h2>
      <p className="text-text-secondary text-lg">
        Ready to dive into your studies? Here's a quick overview of your momentum.
      </p>
    </header>
  );
};

export default WelcomeBanner;
