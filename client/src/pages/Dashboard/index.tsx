import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import DashbordNavigation from "../../components/dashboard/DashbordNavigation";
import RecentNotes from "../../components/dashboard/RecentNotes";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="wrapper">
        <WelcomeBanner />
        <DashbordNavigation />
        <RecentNotes />
      </div>
    </div>
  );
};

export default Dashboard;
