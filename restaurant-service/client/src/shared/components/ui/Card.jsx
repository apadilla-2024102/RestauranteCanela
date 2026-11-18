/** Superficie base. `as` permite usar article/section/Link. */
export const Card = ({ as: Tag = 'div', className = '', padded = true, interactive = false, children, ...props }) => (
  <Tag
    className={['card', padded && 'card--padded', interactive && 'card--interactive', className].filter(Boolean).join(' ')}
    {...props}
  >
    {children}
  </Tag>
);

export const CardHeader = ({ title, description, action }) => (
  <div className="card__header">
    <div className="grow">
      <h2 className="card__title">{title}</h2>
      {description && <p className="card__description">{description}</p>}
    </div>
    {action}
  </div>
);
