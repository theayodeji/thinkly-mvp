import Badge from "./Badge";

const AchievementBadges = () => {
  return (
    <div className="flex flex-col">
      <p className="text-lg font-semibold mb-2">Your Acheivements</p>
      <div className="w-full overflow-hidden">
        <div className="flex overflow-auto md:grid md:grid-cols-4 gap-2 w-full">
          {/* <div className="flex flex-col gap-1 items-center justify-center">
            <Badge />
            <p className="font-semibold text-xs md:text-sm text-center">
              Thinkly Scholar
            </p>
          </div> */}
        </div>
        <h1 className="font-bold text-3xl w-full text-center py-4 opacity-45">
          Coming <span className="text-primary-400">Soon</span>
        </h1>
      </div>
    </div>
  );
};

export default AchievementBadges;
