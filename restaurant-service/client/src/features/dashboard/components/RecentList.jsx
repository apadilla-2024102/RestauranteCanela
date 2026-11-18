import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx';

/** Lista compacta de actividad reciente (órdenes, reservaciones). */
export const RecentList = ({ title, to, items, loading, renderItem, emptyText }) => (
  <Card padded={false} className="recent">
    <div className="recent__header">
      <h2 className="section-title">{title}</h2>
      <Link to={to} className="recent__link">
        Ver todo <ArrowRight size={14} />
      </Link>
    </div>
    {loading ? (
      <ul className="recent__list">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="recent__item">
            <div className="grow stack" style={{ '--gap': '6px' }}>
              <Skeleton width="45%" />
              <Skeleton width="30%" height={12} />
            </div>
            <Skeleton width={64} height={20} radius={999} />
          </li>
        ))}
      </ul>
    ) : items.length === 0 ? (
      <p className="recent__empty">{emptyText}</p>
    ) : (
      <ul className="recent__list">
        {items.map((item, index) => (
          <li key={item.id || item._id || index} className="recent__item" style={{ '--row': index }}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    )}
  </Card>
);
