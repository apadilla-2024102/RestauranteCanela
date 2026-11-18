import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authStore.jsx';
import { Brand } from './layout/Brand.jsx';
import { SidebarNav } from './layout/SidebarNav.jsx';
import { UserCard } from './layout/UserCard.jsx';
import { MobileTopbar } from './layout/MobileTopbar.jsx';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__top">
          <Brand />
        </div>
        <div className="sidebar__scroll">
          <SidebarNav />
        </div>
        <div className="sidebar__bottom">
          <UserCard user={user} onLogout={handleLogout} />
        </div>
      </aside>

      <MobileTopbar user={user} onLogout={handleLogout} />

      {/* key: re-monta el contenido para la entrada sutil al cambiar de ruta */}
      <main className="main" key={pathname}>
        <div className="main__inner">{children}</div>
      </main>
    </div>
  );
};
