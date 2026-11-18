import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Mail, Phone, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { TableCard } from '../../../shared/components/ui/TableCard.jsx';
import { RowActions } from '../../../shared/components/ui/RowActions.jsx';
import { SearchField, Toolbar } from '../../../shared/components/ui/SearchField.jsx';
import { Field, Input, Select } from '../../../shared/components/ui/Field.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import { formatDate, entityId, restaurantName } from '../../../shared/lib/format.js';
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../../../shared/api/reservationsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';

const FORM_ID = 'reservation-form';
const EMPTY = { restaurantId: '', customerName: '', email: '', phone: '', date: '', time: '', guests: '' };

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    loadReservations();
    loadRestaurants();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservations();
      setReservations(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error al cargar reservaciones');
      toast.error('Error al cargar reservaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Error al cargar restaurantes');
      console.error(err);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return reservations;
    return reservations.filter((r) =>
      [r.customerName, r.email, r.phone].some((f) => (f || '').toLowerCase().includes(term))
    );
  }, [reservations, search]);

  const totalGuests = useMemo(
    () => filtered.reduce((sum, r) => sum + (Number(r.guests) || 0), 0),
    [filtered]
  );

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setSheetOpen(true);
  };

  const handleEdit = (reservation) => {
    setFormData({
      restaurantId: reservation.restaurantId?._id || reservation.restaurantId || '',
      customerName: reservation.customerName || '',
      email: reservation.email || '',
      phone: reservation.phone || '',
      date: reservation.date ? String(reservation.date).slice(0, 10) : '',
      time: reservation.time || '',
      guests: reservation.guests || '',
    });
    setEditingId(entityId(reservation));
    setSheetOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { restaurantId, customerName, email, date, time, guests } = formData;
    if (!restaurantId || !customerName || !email || !date || !time || !guests) {
      toast.error('Restaurante, nombre, email, fecha, hora y número de personas son requeridos');
      return;
    }

    const payload = { ...formData, guests: Number(formData.guests) };

    setSaving(true);
    try {
      if (editingId) {
        await updateReservation(editingId, payload);
        toast.success('Reservación actualizada');
      } else {
        await createReservation(payload);
        toast.success('Reservación creada');
      }
      setSheetOpen(false);
      loadReservations();
    } catch (err) {
      toast.error('Error al guardar reservación');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reservation) => {
    const ok = await confirmAction({
      title: `¿Eliminar la reservación de ${reservation.customerName}?`,
      description: 'Esta acción no se puede deshacer.',
    });
    if (!ok) return;
    try {
      await deleteReservation(entityId(reservation));
      toast.success('Reservación eliminada');
      loadReservations();
    } catch (err) {
      toast.error('Error al eliminar reservación');
    }
  };

  const columns = [
    {
      key: 'customer',
      header: 'Cliente',
      render: (r) => (
        <div>
          <p className="table__primary">{r.customerName}</p>
          <p className="table__secondary">{r.phone || r.email}</p>
        </div>
      ),
    },
    {
      key: 'when',
      header: 'Fecha',
      render: (r) => (
        <div className="date-cell">
          <span className="tabular">{formatDate(r.date, { weekday: 'short', day: '2-digit', month: 'short' })}</span>
          <span className="date-cell__time tabular">{r.time || '—'}</span>
        </div>
      ),
    },
    {
      key: 'guests',
      header: 'Personas',
      render: (r) => (
        <span className="row text-muted tabular" style={{ '--gap': '6px' }}>
          <Users size={14} /> {r.guests}
        </span>
      ),
    },
    {
      key: 'restaurant',
      header: 'Restaurante',
      render: (r) => <span className="text-muted nowrap">{restaurantName(r.restaurantId, restaurants)}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (r) => <span className="text-muted">{r.email}</span>,
    },
    {
      key: 'actions',
      header: <span className="visually-hidden">Acciones</span>,
      align: 'right',
      width: 96,
      render: (r) => (
        <RowActions label={`reservación de ${r.customerName}`} onEdit={() => handleEdit(r)} onDelete={() => handleDelete(r)} />
      ),
    },
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow="Operación"
        title="Reservaciones"
        description="Ocupación prevista y datos de contacto de cada reservación."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nueva reservación
          </Button>
        }
      />

      <Toolbar
        meta={!loading && !error ? `${filtered.length} reservaciones · ${totalGuests} personas` : null}
      >
        <SearchField value={search} onChange={setSearch} placeholder="Buscar por nombre, email o teléfono" />
      </Toolbar>

      <TableCard
        loading={loading}
        error={error}
        onRetry={loadReservations}
        rows={filtered}
        columns={columns}
        caption="Reservaciones"
        empty={{
          icon: CalendarDays,
          title: search ? 'Sin resultados' : 'No hay reservaciones',
          description: search ? 'Prueba con otro término.' : 'Las reservaciones nuevas aparecerán aquí.',
        }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar reservación' : 'Nueva reservación'}
        description="Fecha, hora y número de personas."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving}>
              {editingId ? 'Guardar cambios' : 'Crear reservación'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="stack" onSubmit={handleSubmit}>
          <Field
            label="Restaurante"
            hint={
              restaurantsLoading
                ? 'Cargando restaurantes…'
                : restaurants.length === 0
                  ? 'No se encontraron restaurantes. Crea uno primero.'
                  : undefined
            }
          >
            {(a11y) => (
              <Select {...a11y} value={formData.restaurantId} onChange={set('restaurantId')} disabled={restaurantsLoading}>
                <option value="">Selecciona un restaurante</option>
                {restaurants.map((r) => (
                  <option key={entityId(r)} value={entityId(r)}>
                    {r.name || r.description || entityId(r)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Nombre del cliente">
            {(a11y) => <Input {...a11y} value={formData.customerName} onChange={set('customerName')} placeholder="María López" />}
          </Field>
          <div className="grid-2">
            <Field label="Email">
              {(a11y) => (
                <Input {...a11y} type="email" value={formData.email} onChange={set('email')} placeholder="maria@correo.com" leading={<Mail size={16} />} />
              )}
            </Field>
            <Field label="Teléfono">
              {(a11y) => (
                <Input {...a11y} type="tel" value={formData.phone} onChange={set('phone')} placeholder="+502 1234 5678" leading={<Phone size={16} />} />
              )}
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Fecha">{(a11y) => <Input {...a11y} type="date" value={formData.date} onChange={set('date')} />}</Field>
            <Field label="Hora">{(a11y) => <Input {...a11y} type="time" value={formData.time} onChange={set('time')} />}</Field>
          </div>
          <Field label="Personas">
            {(a11y) => (
              <Input {...a11y} type="number" inputMode="numeric" min="1" value={formData.guests} onChange={set('guests')} placeholder="2" leading={<Users size={16} />} />
            )}
          </Field>
        </form>
      </Sheet>
    </Layout>
  );
};
