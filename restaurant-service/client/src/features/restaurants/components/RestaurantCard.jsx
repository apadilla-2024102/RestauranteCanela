import { Copy, MapPin, Pencil, Phone, Trash2, Clock } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { shortId } from '../../../shared/lib/format.js';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'R';

export const RestaurantCard = ({ restaurant, index = 0, onEdit, onDelete, onCopyId }) => {
  const id = restaurant.id || restaurant._id;
  const active = restaurant.isActive !== false;

  return (
    <article className="restaurant-card" style={{ '--i': Math.min(index, 8) }}>
      <div className="restaurant-card__media">
        {restaurant.imageUrl ? (
          <img src={restaurant.imageUrl} alt="" loading="lazy" />
        ) : (
          <span className="restaurant-card__placeholder">{initials(restaurant.name)}</span>
        )}
        <span className="restaurant-card__status">
          <Badge tone={active ? 'success' : 'neutral'}>{active ? 'Activo' : 'Inactivo'}</Badge>
        </span>
      </div>

      <div className="restaurant-card__body">
        <div className="row row--between" style={{ alignItems: 'flex-start' }}>
          <h3 className="restaurant-card__name">{restaurant.name}</h3>
          <button type="button" className="id-chip" onClick={() => onCopyId(id)} title="Copiar ID completo">
            <span className="mono">#{shortId(id)}</span>
            <Copy size={12} />
          </button>
        </div>

        <p className="restaurant-card__description line-clamp-2">
          {restaurant.description || 'Sin descripción.'}
        </p>

        <ul className="restaurant-card__meta">
          <li>
            <MapPin size={14} />
            <span className="truncate">{restaurant.address || 'Sin dirección'}</span>
          </li>
          <li>
            <Phone size={14} />
            <span className="truncate">{restaurant.phone || 'Sin teléfono'}</span>
          </li>
          {restaurant.openingHours && (
            <li>
              <Clock size={14} />
              <span className="truncate">{restaurant.openingHours}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="restaurant-card__footer">
        <Button variant="ghost" size="sm" onClick={() => onEdit(restaurant)}>
          <Pencil /> Editar
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(id)}>
          <Trash2 /> Eliminar
        </Button>
      </div>
    </article>
  );
};
