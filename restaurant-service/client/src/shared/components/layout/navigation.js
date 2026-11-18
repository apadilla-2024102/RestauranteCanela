import { LayoutGrid, Store, UtensilsCrossed, ShoppingBag, CalendarDays, CreditCard, LineChart } from 'lucide-react';

export const NAV_SECTIONS = [
  {
    label: 'General',
    items: [{ label: 'Panel', path: '/dashboard', icon: LayoutGrid }],
  },
  {
    label: 'Operación',
    items: [
      { label: 'Restaurantes', path: '/restaurants', icon: Store },
      { label: 'Menú', path: '/menu', icon: UtensilsCrossed },
      { label: 'Órdenes', path: '/orders', icon: ShoppingBag },
      { label: 'Reservaciones', path: '/reservations', icon: CalendarDays },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { label: 'Pagos', path: '/payments', icon: CreditCard },
      { label: 'Reportes', path: '/reports', icon: LineChart },
    ],
  },
];
