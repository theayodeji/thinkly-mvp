import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import { Sidebar } from '../../components/ui/Sidebar';
import { BottomNavigation } from '../../components/ui/BottomNavigation';
import FloatingTimer from '../../components/ui/FloatingTimer';
import { useTheme } from '../../contexts/ThemeContext';
import { useUIStore } from '../../store/uiStore';

const MainLayout = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : 'light'} bg-bg text-text`}>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="relative flex-1 flex flex-col min-w-0 max-h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
      <FloatingTimer />
    </div>
  );
};

export default MainLayout;

