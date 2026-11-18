import { CalendarDays, ShoppingBag, TrendingUp } from 'lucide-react';

/** Panel decorativo del login: muestra el tipo de información que se gestiona. */
export const LoginShowcase = () => (
  <aside className="showcase" aria-hidden="true">
    <div className="showcase__pattern" />
    <div className="showcase__glow" />

    <div className="showcase__stack">
      <div className="showcase__card" style={{ '--i': 0 }}>
        <span className="showcase__icon">
          <CalendarDays size={16} />
        </span>
        <div className="grow">
          <p className="showcase__title">Reservación confirmada</p>
          <p className="showcase__meta">Mesa 4 · 19:30 · 4 personas</p>
        </div>
        <span className="badge badge--success">
          <span className="badge__dot" />
          Hoy
        </span>
      </div>

      <div className="showcase__card" style={{ '--i': 1 }}>
        <span className="showcase__icon">
          <ShoppingBag size={16} />
        </span>
        <div className="grow">
          <p className="showcase__title">Orden lista para servir</p>
          <p className="showcase__meta">2 platos principales · 1 postre</p>
        </div>
        <span className="badge badge--info">
          <span className="badge__dot" />
          Lista
        </span>
      </div>

      <div className="showcase__card showcase__card--metric" style={{ '--i': 2 }}>
        <span className="showcase__icon">
          <TrendingUp size={16} />
        </span>
        <div className="grow">
          <p className="showcase__meta">Ventas de la semana</p>
          <p className="showcase__value tabular">+18.4%</p>
        </div>
        <svg className="showcase__spark" viewBox="0 0 120 36" fill="none">
          <path d="M2 30 L20 24 L36 27 L54 16 L72 19 L90 9 L118 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>

    <p className="showcase__quote">
      Todo tu restaurante,
      <br />
      en un solo lugar.
    </p>
  </aside>
);
