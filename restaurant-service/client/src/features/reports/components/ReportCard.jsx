import { BarChart3, Box, CalendarCheck2, CreditCard, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { RowActions } from '../../../shared/components/ui/RowActions.jsx';
import { formatDate, formatMoney, restaurantName } from '../../../shared/lib/format.js';

export const REPORT_TYPES = {
  sales: { label: 'Ventas', icon: DollarSign },
  revenue: { label: 'Ingresos', icon: BarChart3 },
  orders: { label: 'Órdenes', icon: ShoppingCart },
  reservations: { label: 'Reservaciones', icon: CalendarCheck2 },
  payments: { label: 'Pagos', icon: CreditCard },
  customers: { label: 'Clientes', icon: Users },
  inventory: { label: 'Inventario', icon: Box },
};

const METRICS = [
  { key: 'totalSales', label: 'Ventas', money: true },
  { key: 'totalRevenue', label: 'Ingresos', money: true },
  { key: 'totalOrders', label: 'Órdenes' },
  { key: 'averageOrderValue', label: 'Ticket promedio', money: true },
  { key: 'total', label: 'Total', money: true },
  { key: 'sales', label: 'Ventas', money: true },
  { key: 'revenue', label: 'Ingresos', money: true },
];

const KNOWN = new Set([...METRICS.map((m) => m.key), 'summary']);

export const ReportCard = ({ report, restaurants, index = 0, onEdit, onDelete }) => {
  const type = REPORT_TYPES[report.type] || { label: report.type, icon: BarChart3 };
  const Icon = type.icon;
  const data = report.data && typeof report.data === 'object' ? report.data : {};
  const metrics = METRICS.filter((m) => data[m.key] != null).slice(0, 4);
  const extras = Object.entries(data).filter(([key, value]) => !KNOWN.has(key) && value != null);

  const summary =
    report.description ||
    data.summary ||
    (data.totalSales != null ? `Ventas: ${data.totalSales}` : data.total != null ? `Ventas: ${data.total}` : 'Resumen no disponible');

  return (
    <article className="report-card" style={{ '--i': Math.min(index, 8) }}>
      <header className="report-card__header">
        <span className="report-card__icon">
          <Icon size={16} />
        </span>
        <div className="grow">
          <h3 className="report-card__title">{report.title}</h3>
          <p className="report-card__meta">
            {type.label}
            {report.restaurantId && <> · {restaurantName(report.restaurantId, restaurants)}</>}
          </p>
        </div>
        <RowActions label={report.title} onEdit={() => onEdit(report)} onDelete={() => onDelete(report)} />
      </header>

      <p className="report-card__summary">{summary}</p>

      {metrics.length > 0 && (
        <dl className="report-card__metrics">
          {metrics.map((m) => (
            <div key={m.key}>
              <dt>{m.label}</dt>
              <dd className="tabular">{m.money ? formatMoney(data[m.key]) : String(data[m.key])}</dd>
            </div>
          ))}
        </dl>
      )}

      {extras.length > 0 && (
        <details className="report-card__extra">
          <summary>Más datos</summary>
          <ul>
            {extras.map(([key, value]) => (
              <li key={key}>
                <span className="mono">{key}</span>: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </li>
            ))}
          </ul>
        </details>
      )}

      <footer className="report-card__footer tabular">
        {report.dateRange?.start && (
          <span>
            {formatDate(report.dateRange.start)} – {formatDate(report.dateRange.end)}
          </span>
        )}
        {report.createdAt && <span>Creado {formatDate(report.createdAt)}</span>}
      </footer>
    </article>
  );
};
