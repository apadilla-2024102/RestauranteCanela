import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { Building2, FileText, ShoppingCart, Calendar, ArrowRight } from 'lucide-react';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders } from '../../../shared/api/ordersApi.js';
import { getAllReservations } from '../../../shared/api/reservationsApi.js';
import { getAllMenuItems } from '../../../shared/api/menuApi.js';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    orders: 0,
    reservations: 0,
    menuItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [restaurants, orders, reservations, menuItems] = await Promise.all([
          getAllRestaurants().catch(() => []),
          getAllOrders().catch(() => []),
          getAllReservations().catch(() => []),
          getAllMenuItems().catch(() => []),
        ]);

        setStats({
          restaurants: Array.isArray(restaurants) ? restaurants.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          reservations: Array.isArray(reservations) ? reservations.length : 0,
          menuItems: Array.isArray(menuItems) ? menuItems.length : 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Restaurantes',
      value: stats.restaurants,
      icon: Building2,
      gradientBackground: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
    },
    {
      label: 'Items de Menú',
      value: stats.menuItems,
      icon: FileText,
      gradientBackground: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
    },
    {
      label: 'Órdenes',
      value: stats.orders,
      icon: ShoppingCart,
      gradientBackground: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    },
    {
      label: 'Reservas',
      value: stats.reservations,
      icon: Calendar,
      gradientBackground: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Visión general</p>
            <h1>Panel ejecutivo</h1>
          
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <div className="stats-card">
              <p className="text-sm uppercase tracking-widest text-slate-500">Resumen empresarial</p>
              <p className="text-3xl font-bold text-slate-900 mt-3">{stats.restaurants + stats.orders + stats.reservations + stats.menuItems}</p>
              <p className="text-sm text-slate-600 mt-2">Indicadores activos y lista para gestión inmediata.</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="stats-card">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-gray-500 text-sm uppercase tracking-widest">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-3">{card.value}</p>
                    </div>
                    <div className="stats-card__icon" style={{ background: card.gradientBackground }}>
                      <Icon size={26} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-6 border border-slate-200/80">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Accesos rápidos</h2>
              <p className="text-sm text-slate-600">Navega a los módulos más importantes en un solo clic.</p>
            </div>
          </div>
          <div className="quick-actions">
            <Link to="/restaurants" className="quick-action-card">
              <div className="text-3xl text-red-500">
                <Building2 size={28} />
              </div>
              <h3 className="quick-action-card__title">Restaurantes</h3>
              <p className="quick-action-card__subtitle">Gestiona el catálogo de locales y su información.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                Ver módulo <ArrowRight size={16} />
              </div>
            </Link>
            <Link to="/menu" className="quick-action-card">
              <div className="text-3xl text-blue-500">
                <FileText size={28} />
              </div>
              <h3 className="quick-action-card__title">Menú</h3>
              <p className="quick-action-card__subtitle">Organiza y actualiza los platos con estilo ágil.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                Ver módulo <ArrowRight size={16} />
              </div>
            </Link>
            <Link to="/orders" className="quick-action-card">
              <div className="text-3xl text-emerald-500">
                <ShoppingCart size={28} />
              </div>
              <h3 className="quick-action-card__title">Órdenes</h3>
              <p className="quick-action-card__subtitle">Controla pedidos activos y su seguimiento.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                Ver módulo <ArrowRight size={16} />
              </div>
            </Link>
            <Link to="/reservations" className="quick-action-card">
              <div className="text-3xl text-orange-500">
                <Calendar size={28} />
              </div>
              <h3 className="quick-action-card__title">Reservas</h3>
              <p className="quick-action-card__subtitle">Supervisa la ocupación y el flujo de clientes.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                Ver módulo <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
