/** Cabecera de página: título, descripción y acciones alineadas. */
export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <header className="page-header">
    <div className="grow">
      {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
      <h1 className="page-header__title">{title}</h1>
      {description && <p className="page-header__description">{description}</p>}
    </div>
    {actions && <div className="page-header__actions">{actions}</div>}
  </header>
);
