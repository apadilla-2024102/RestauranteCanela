/** Etiqueta de estado. Tonos: neutral | success | warning | danger | info | accent. */
export const Badge = ({ tone = 'neutral', dot = true, children }) => (
  <span className={`badge badge--${tone}`}>
    {dot && <span className="badge__dot" aria-hidden="true" />}
    {children}
  </span>
);
