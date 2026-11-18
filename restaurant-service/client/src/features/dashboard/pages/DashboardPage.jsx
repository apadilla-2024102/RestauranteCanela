import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Store, UtensilsCrossed, ShoppingBag, CalendarDays } from 'lucide-react';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { QuickActions } from '../components/QuickActions.jsx';
import { RecentList } from '../components/RecentList.jsx';
import { useAuth } from '../../auth/store/authStore.jsx';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders } from '../../../shared/api/ordersApi.js';
import { getAllReservations } from '../../../shared/api/reservationsApi.js';
import { getAllMenuItems } from '../../../shared/api/menuApi.js';
import { formatMoney, formatDate, restaurantName } from '../../../shared/lib/format.js';
import { ORDER_STATUS, statusOf } from '../../../shared/lib/status.js';

const asList = (value) => (Array.isArray(value) ? value : []);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ restaurants: [], orders: [], reservations: [], menuItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [restaurants, orders, reservations, menuItems] = await Promise.all([
          getAllRestaurants().catch(() => []),
          getAllOrders().catch(() => []),
          getAllReservations().catch(() => []),
          getAllMenuItems().catch(() => []),
        ]);
        setData({
          restaurants: asList(restaurants),
          orders: asList(orders),
          reservations: asList(reservations),
          menuItems: asList(menuItems),
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recentOrders = useMemo(() => [...data.orders].reverse().slice(0, 5), [data.orders]);
  const recentReservations = useMemo(() => [...data.reservations].reverse().slice(0, 5), [data.reservations]);

  const stats = [
    { label: 'Restaurantes', value: data.restaurants.length, icon: Store, hint: 'Locales registrados' },
    { label: 'Platos en menú', value: data.menuItems.length, icon: UtensilsCrossed, hint: 'Elementos disponibles' },
    { label: 'Órdenes', value: data.orders.length, icon: ShoppingBag, hint: 'Total histórico' },
    { label: 'Reservaciones', value: data.reservations.length, icon: CalendarDays, hint: 'Total registradas' },
  ];

  const firstName = (user?.name || user?.username || '').split(' ')[0];
  const today = new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Layout>
      <PageHeader
        eyebrow={today.charAt(0).toUpperCase() + today.slice(1)}
        title={firstName ? `${greeting()}, ${firstName}` : greeting()}
        description="Este es el resumen de tu operación."
      />

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} loading={loading} index={index} />
        ))}
      </div>

      <div className="dashboard-columns">
        <RecentList
          title="Órdenes recientes"
          to="/orders"
          items={recentOrders}
          loading={loading}
          emptyText="Aún no hay órdenes registradas."
          renderItem={(order) => {
            const status = statusOf(ORDER_STATUS, order.status);
            return (
              <>
                <div className="grow">
                  <p className="table__primary truncate">{order.customerName || 'Cliente'}</p>
                  <p className="table__secondary truncate">
                    {restaurantName(order.restaurantId, data.restaurants)} · <span className="tabular">{formatMoney(order.total)}</span>
                  </p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
              </>
            );
          }}
        />
        <RecentList
          title="Próximas reservaciones"
          to="/reservations"
          items={recentReservations}
          loading={loading}
          emptyText="Aún no hay reservaciones."
          renderItem={(res) => (
            <>
              <div className="grow">
                <p className="table__primary truncate">{res.customerName}</p>
                <p className="table__secondary truncate">{restaurantName(res.restaurantId, data.restaurants)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm tabular">{formatDate(res.date, { day: '2-digit', month: 'short' })}</p>
                <p className="text-xs text-subtle tabular">
                  {res.time || '—'} · {res.guests} pers.
                </p>
              </div>
            </>
          )}
        />
      </div>

      <QuickActions />
    </Layout>
  );
};
