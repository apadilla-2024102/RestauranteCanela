import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      <nav className="navbar border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="navbar-toggle"
              >
                <MenuIcon size={20} />
              </button>
              <div className="brand-identity">
                <div className="brand-logo">
                  <span>G</span>
                </div>
                <div>
                  <p className="brand-label">Restaurante Canela</p>
                  <p className="brand-tagline">Plataforma empresarial de gestión</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="user-chip">
                <User size={18} />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn--secondary logout-button"
              >
                <LogOut size={16} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } sidebar-panel text-slate-900 overflow-hidden border-r border-slate-200/60`}
        >
          <div className="p-6">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 main-content">
          {children}
        </div>
      </div>
    </div>
  );
};
