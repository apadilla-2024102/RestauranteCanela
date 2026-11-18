import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { Button } from './Button.jsx';

/**
 * Panel deslizante para formularios.
 * Escritorio: entra desde la derecha. Móvil: hoja inferior que se puede arrastrar para cerrar.
 */
export const Sheet = ({ open, onOpenChange, title, description, children, footer }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const direction = isDesktop ? 'right' : 'bottom';

  return (
    <Drawer.Root key={direction} open={open} onOpenChange={onOpenChange} direction={direction}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet__overlay" />
        <Drawer.Content className={`sheet sheet--${direction}`}>
          {!isDesktop && <Drawer.Handle className="sheet__handle" />}
          <div className="sheet__header">
            <div className="grow">
              <Drawer.Title className="sheet__title">{title}</Drawer.Title>
              {description ? (
                <Drawer.Description className="sheet__description">{description}</Drawer.Description>
              ) : (
                <Drawer.Description className="visually-hidden">{title}</Drawer.Description>
              )}
            </div>
            <Drawer.Close asChild>
              <Button variant="ghost" size="sm" icon aria-label="Cerrar">
                <X />
              </Button>
            </Drawer.Close>
          </div>
          <div className="sheet__body">{children}</div>
          {footer && <div className="sheet__footer">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
