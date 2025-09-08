import { Outlet } from 'react-router-dom';
import Navbar from '../../components/ui/Navbar';

const MainLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default MainLayout;
