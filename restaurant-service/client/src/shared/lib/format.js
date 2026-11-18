/** Formateadores compartidos para que montos, fechas e IDs se vean igual en toda la app. */
export const formatMoney = (value) => {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) return '—';
  const amount = n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + amount;
};

export const formatDate = (value, options = { day: '2-digit', month: 'short', year: 'numeric' }) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-GT', options);
};

export const shortId = (value) => {
  const id = typeof value === 'object' && value !== null ? value._id || value.id : value;
  return id ? String(id).slice(-6).toUpperCase() : '—';
};

export const entityId = (entity) => entity?.id || entity?._id;

export const restaurantName = (ref, restaurants = []) => {
  if (!ref) return '—';
  if (typeof ref === 'object') return ref.name || shortId(ref);
  const match = restaurants.find((r) => entityId(r) === ref);
  return match?.name || shortId(ref);
};
