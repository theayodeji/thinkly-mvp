import React from "react";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import DashbordNavigation from "../../components/dashboard/DashbordNavigation";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="wrapper">
        <WelcomeBanner />
        <DashbordNavigation />
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Your dashboard content will appear here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
