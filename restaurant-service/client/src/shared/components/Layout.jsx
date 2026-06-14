import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authStore.jsx';
import {
  BarChart3,
  Building2,
  FileText,
  ShoppingCart,
  Calendar,
  CreditCard,
  TrendingUp,
  Menu as MenuIcon,
  LogOut,
  User
} from 'lucide-react';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768
  );
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Panel', path: '/dashboard', icon: BarChart3 },
    { label: 'Restaurantes', path: '/restaurants', icon: Building2 },
    { label: 'Menú', path: '/menu', icon: FileText },
    { label: 'Órdenes', path: '/orders', icon: ShoppingCart },
    { label: 'Reservaciones', path: '/reservations', icon: Calendar },
    { label: 'Pagos', path: '/payments', icon: CreditCard },
    { label: 'Reportes', path: '/reports', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen app-shell">
      {/* Navbar */}
      <nav className="navbar fixed top-0 left-0 right-0 z-40 border-b border-slate-200/60 shadow-sm">
        <div className="px-3 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="navbar-toggle"
            >
              <MenuIcon size={20} />
            </button>
            <div className="brand-logo">
              <span>G</span>
            </div>
            <div className="hidden sm:block">
              <p className="brand-label">Restaurante Canela</p>
            </div>
          </div>

          {/* Right Side - Desktop only */}
          {isDesktop && (
            <div className="flex items-center gap-3">
              <div className="user-chip">
                <User size={16} />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn--secondary logout-button"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="flex mt-14 lg:mt-16">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 sidebar-panel text-slate-900 overflow-hidden border-r border-slate-200/60 flex flex-col ${
            sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
          } ${sidebarOpen ? 'w-64' : 'w-0'}`}
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Navegación</h2>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white/90 text-slate-900 border-l-4 border-rose-500 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User section at bottom (mobile only) */}
          <div className="lg:hidden border-t border-slate-200 p-4 space-y-3">
            <div className="px-3 py-2 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Sesión</p>
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-medium text-sm"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 main-content">
          {children}
        </div>
      </div>

      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};
