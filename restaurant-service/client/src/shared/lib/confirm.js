import { toast } from 'sonner';

/**
 * Confirmación no bloqueante con Sonner, en lugar de window.confirm.
 * Resuelve true si el usuario confirma; false si cancela o el toast expira.
 */
export const confirmAction = ({ title, description, confirmLabel = 'Eliminar', cancelLabel = 'Cancelar' }) =>
  new Promise((resolve) => {
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    toast(title, {
      description,
      duration: 8000,
      action: { label: confirmLabel, onClick: () => settle(true) },
      cancel: { label: cancelLabel, onClick: () => settle(false) },
      onDismiss: () => settle(false),
      onAutoClose: () => settle(false),
    });
  });
