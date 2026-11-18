/** Spinner de 8 barras. Gira rápido: un spinner veloz hace que la carga se perciba más corta. */
export const Spinner = ({ size = 16, label = 'Cargando' }) => (
  <span className="spinner" style={{ '--size': `${size}px` }} role="status" aria-label={label}>
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="spinner__bar" style={{ '--i': i }} />
    ))}
  </span>
);
