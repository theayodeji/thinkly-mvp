import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';
import FloatingTimer from '../../components/ui/FloatingTimer';

const MainLayout = () => {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Outlet />
      <FloatingTimer />
    </main>
  );
};

export default MainLayout;
