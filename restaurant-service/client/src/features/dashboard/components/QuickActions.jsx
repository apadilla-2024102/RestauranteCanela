import { Link } from 'react-router-dom';
import { ArrowUpRight, Store, UtensilsCrossed, ShoppingBag, CalendarDays } from 'lucide-react';

const ACTIONS = [
  { to: '/restaurants', icon: Store, title: 'Restaurantes', text: 'Locales, horarios y datos de contacto.' },
  { to: '/menu', icon: UtensilsCrossed, title: 'Menú', text: 'Platos, precios y categorías.' },
  { to: '/orders', icon: ShoppingBag, title: 'Órdenes', text: 'Pedidos activos y su estado.' },
  { to: '/reservations', icon: CalendarDays, title: 'Reservaciones', text: 'Ocupación y flujo de clientes.' },
];

export const QuickActions = () => (
  <section className="stack" style={{ '--gap': '12px' }}>
    <h2 className="section-title">Accesos rápidos</h2>
    <div className="quick-actions">
      {ACTIONS.map(({ to, icon: Icon, title, text }) => (
        <Link key={to} to={to} className="quick-action">
          <span className="quick-action__icon">
            <Icon size={16} strokeWidth={1.75} />
          </span>
          <span className="quick-action__body">
            <span className="quick-action__title">{title}</span>
            <span className="quick-action__text">{text}</span>
          </span>
          <ArrowUpRight className="quick-action__arrow" size={16} />
        </Link>
      ))}
    </div>
  </section>
);
