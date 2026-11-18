import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './Button.jsx';

/** Acciones de fila (editar / eliminar) como botones de icono con etiqueta accesible. */
export const RowActions = ({ onEdit, onDelete, label = 'elemento' }) => (
  <div className="table__actions">
    {onEdit && (
      <Button variant="ghost" size="sm" icon onClick={onEdit} aria-label={`Editar ${label}`} title="Editar">
        <Pencil />
      </Button>
    )}
    {onDelete && (
      <Button variant="danger" size="sm" icon onClick={onDelete} aria-label={`Eliminar ${label}`} title="Eliminar">
        <Trash2 />
      </Button>
    )}
  </div>
);
