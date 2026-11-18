import { Search, X } from 'lucide-react';

/** Campo de búsqueda con botón para limpiar. Escape también limpia. */
export const SearchField = ({ value, onChange, placeholder = 'Buscar…', label = 'Buscar' }) => (
  <div className="search-field">
    <Search className="search-field__icon" size={16} aria-hidden="true" />
    <input
      type="search"
      className="input search-field__input"
      value={value}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onChange('');
      }}
    />
    {value && (
      <button type="button" className="search-field__clear" onClick={() => onChange('')} aria-label="Limpiar búsqueda">
        <X size={14} />
      </button>
    )}
  </div>
);

/** Barra sobre listas: búsqueda a la izquierda, contador o filtros a la derecha. */
export const Toolbar = ({ children, meta }) => (
  <div className="toolbar">
    <div className="toolbar__main">{children}</div>
    {meta && <p className="toolbar__meta tabular">{meta}</p>}
  </div>
);
