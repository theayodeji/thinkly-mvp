import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import { Sidebar } from '../../components/ui/Sidebar';
import { BottomNavigation } from '../../components/ui/BottomNavigation';
import FloatingTimer from '../../components/ui/FloatingTimer';
import { useTheme } from '../../contexts/ThemeContext';
import { useUIStore } from '../../store/uiStore';
import { EmailVerificationBanner } from '../../components/auth/EmailVerificationBanner';

const MainLayout = () => {
  const { theme } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className={`flex h-screen h-[100dvh] overflow-hidden ${theme === 'dark' ? 'dark' : 'light'} bg-bg text-text`}>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="relative flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />
        <EmailVerificationBanner />
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
      <FloatingTimer />
    </div>
  );
};

export default MainLayout;
