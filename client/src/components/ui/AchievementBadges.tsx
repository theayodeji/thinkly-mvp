import Badge from "./Badge";

type Props = {};

const AchievementBadges = (props: Props) => {
  return (
    <div className="flex flex-col">
      <p className="text-lg font-semibold mb-2">Your Acheivements</p>
      <div className="w-full overflow-hidden">
        <div className="flex overflow-auto md:grid md:grid-cols-4 gap-2 w-full">
          <div className="flex flex-col gap-1 items-center justify-center">
            <Badge />
            <p className="font-semibold text-xs md:text-sm text-center">
              Thinkly Scholar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;
