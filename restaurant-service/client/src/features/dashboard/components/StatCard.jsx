import { NumberTicker } from '../../../shared/components/ui/NumberTicker.jsx';
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx';

export const StatCard = ({ label, value, icon: Icon, hint, loading, index = 0 }) => (
  <div className="stat-card" style={{ '--i': index }}>
    <div className="stat-card__top">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__icon">
        <Icon size={15} strokeWidth={1.75} />
      </span>
    </div>
    <p className="stat-card__value">{loading ? <Skeleton width={56} height={28} /> : <NumberTicker value={value} />}</p>
    {hint && <p className="stat-card__hint">{hint}</p>}
  </div>
);
