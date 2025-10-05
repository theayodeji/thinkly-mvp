import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import FloatingTimer from '../../components/ui/FloatingTimer';
import { useTheme } from '../../contexts/ThemeContext';

const MainLayout = () => {

  const { theme } = useTheme();

  return (
    <main className={`relative min-h-screen ${theme === 'dark' ? 'dark' : 'light'}`}>
      <Navbar />
      <Outlet />
      <FloatingTimer />
    </main>
  );
};

export default MainLayout;
