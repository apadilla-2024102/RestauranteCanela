import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from './Button.jsx';

/** Estado vacío: explica qué falta y ofrece el siguiente paso. */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state">
    {Icon && (
      <div className="empty-state__icon">
        <Icon size={20} />
      </div>
    )}
    <h3 className="empty-state__title">{title}</h3>
    {description && <p className="empty-state__description">{description}</p>}
    {action && <div className="empty-state__action">{action}</div>}
  </div>
);

/** Estado de error con reintento. */
export const ErrorState = ({ title = 'Algo salió mal', message, onRetry }) => (
  <EmptyState
    icon={AlertTriangle}
    title={title}
    description={message}
    action={
      onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw /> Reintentar
        </Button>
      )
    }
  />
);
