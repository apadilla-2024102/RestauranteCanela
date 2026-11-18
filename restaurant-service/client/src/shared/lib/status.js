/** Etiquetas y tonos de estado reutilizados por Badge. */
export const ORDER_STATUS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  confirmed: { label: 'Confirmada', tone: 'info' },
  preparing: { label: 'Preparando', tone: 'accent' },
  ready: { label: 'Lista', tone: 'info' },
  delivered: { label: 'Entregada', tone: 'success' },
  cancelled: { label: 'Cancelada', tone: 'danger' },
};

export const PAYMENT_STATUS = {
  pending: { label: 'Pendiente', tone: 'warning' },
  processing: { label: 'Procesando', tone: 'info' },
  completed: { label: 'Completado', tone: 'success' },
  failed: { label: 'Fallido', tone: 'danger' },
  refunded: { label: 'Reembolsado', tone: 'neutral' },
};

export const PAYMENT_METHOD = {
  credit_card: 'Tarjeta de crédito',
  debit_card: 'Tarjeta de débito',
  cash: 'Efectivo',
  bank_transfer: 'Transferencia',
};

export const MENU_CATEGORY = {
  appetizer: 'Entrada',
  main_course: 'Plato principal',
  dessert: 'Postre',
  beverage: 'Bebida',
  side: 'Acompañamiento',
};

export const statusOf = (map, key) => map[key] || { label: key || '—', tone: 'neutral' };
