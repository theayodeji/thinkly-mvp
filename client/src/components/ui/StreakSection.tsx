
type Props = {
  streak: number;
  longest?: number;
};

const StreakSection = ({ streak, longest }: Props) => {

  const streakMessage = () => {
    if (streak < 1) {
      return "Get in the mood!";
    } else if (streak == 1) {
      return "One in the bag!";
    } else if (streak === 2) {
      return "Consistency!!!";
    } else if (streak === 3) {
      return "3-in-a-row!";
    } else {
      return "You're on a roll!";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <img src="/streak-flame.gif" alt="streak_flame" className="w-24 h-24" />
      <p className="text-lg md:text-2xl font-semibold">
        {streak}-day{" "}
        <span className="font-semibold text-primary-500 dark:text-secondary-500">
          streak!
        </span>
      </p>
      <p className="text-sm md:text-base">{streakMessage()}</p>
      <p className="text-xs md:text-sm -mt-2">
        (Longest -{" "}
        <span className="font-semibold text-primary-500 dark:text-secondary-500">
          {longest || streak} days)
        </span>
      </p>
    </div>
  );
};

export default StreakSection;
