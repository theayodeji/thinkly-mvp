import React from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import DashbordNavigation from "../../components/dashboard/DashbordNavigation";
import RecentNotes from "../../components/dashboard/RecentNotes";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="wrapper">
        <WelcomeBanner />
        <DashbordNavigation />
        <RecentNotes />
      </div>
    </div>
  );
};

export default Dashboard;
