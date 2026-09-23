import { Outlet } from 'react-router-dom';
import LandingNavbar from '../../components/ui/LandingNavbar';
import { useTheme } from '../../contexts/ThemeContext';

const LandingLayout = () => {
  const { theme } = useTheme();

  return (
    <main className={`relative min-h-screen ${theme === 'dark' ? 'dark' : 'light'} bg-bg text-text`}>
      <LandingNavbar />
      <Outlet />
    </main>
  );
};

export default LandingLayout;
