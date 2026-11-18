/** Bloque de carga. Mantiene el layout estable mientras llegan los datos. */
export const Skeleton = ({ width = '100%', height = 14, radius, className = '' }) => (
  <span
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius }}
    aria-hidden="true"
  />
);

export const SkeletonRows = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-rows" role="status" aria-label="Cargando">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="skeleton-rows__row">
        {Array.from({ length: columns }).map((__, c) => (
          <Skeleton key={c} width={c === 0 ? '40%' : `${60 - c * 8}%`} />
        ))}
      </div>
    ))}
  </div>
);
