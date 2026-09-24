import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import QuickActions from "../../components/dashboard/QuickActions";
import LearningProgress from "../../components/dashboard/LearningProgress";
import RecentNotes from "../../components/dashboard/RecentNotes";
import PomodoroTimer from "../../components/dashboard/PomodoroTimer";
import Notifications from "../../components/dashboard/Notifications";

const Dashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <WelcomeBanner />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          <QuickActions />
          <LearningProgress />
          <RecentNotes />
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          <PomodoroTimer />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
