import { useEffect, useMemo, useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { TableCard } from '../../../shared/components/ui/TableCard.jsx';
import { RowActions } from '../../../shared/components/ui/RowActions.jsx';
import { SegmentedControl } from '../../../shared/components/ui/SegmentedControl.jsx';
import { SearchField, Toolbar } from '../../../shared/components/ui/SearchField.jsx';
import { Field, Input, Select, Textarea } from '../../../shared/components/ui/Field.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import { formatMoney, shortId, entityId, restaurantName } from '../../../shared/lib/format.js';
import { ORDER_STATUS, statusOf } from '../../../shared/lib/status.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../../../shared/api/ordersApi.js';

const FORM_ID = 'order-form';
const EMPTY = { restaurantId: '', customerName: '', items: '', total: '', status: 'pending' };

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'delivered', label: 'Entregadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

const ACTIVE = ['pending', 'confirmed', 'preparing', 'ready'];

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    loadRestaurants();
    loadOrders();
  }, []);

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('No se pudieron cargar los restaurantes');
      console.error(err);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error al cargar órdenes');
      toast.error('Error al cargar órdenes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return orders.filter((order) => {
      const matchesFilter =
        filter === 'all' || (filter === 'active' ? ACTIVE.includes(order.status) : order.status === filter);
      const matchesTerm =
        !term ||
        (order.customerName || '').toLowerCase().includes(term) ||
        String(entityId(order) || '').toLowerCase().includes(term);
      return matchesFilter && matchesTerm;
    });
  }, [orders, search, filter]);

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setSheetOpen(true);
  };

  const handleEdit = (order) => {
    setFormData({
      restaurantId: order.restaurantId?._id || order.restaurantId || '',
      customerName: order.customerName || '',
      items: Array.isArray(order.items) ? order.items.map((item) => item.name).join(', ') : order.items || '',
      total: order.total,
      status: order.status,
    });
    setEditingId(entityId(order));
    setSheetOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!formData.restaurantId || !objectIdRegex.test(formData.restaurantId)) {
      toast.error('Selecciona un restaurante válido o ingresa un ID de 24 caracteres hexadecimales');
      return;
    }
    if (!formData.customerName || !formData.total) {
      toast.error('Nombre del cliente y total son requeridos');
      return;
    }

    const itemNames = formData.items
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

    const totalAmount = parseFloat(formData.total) || 0;
    const calculatedPrice = itemNames.length ? totalAmount / itemNames.length : totalAmount;

    const payload = {
      restaurantId: formData.restaurantId,
      customerName: formData.customerName,
      items: itemNames.map((name) => ({
        menuItemId: null,
        name,
        quantity: 1,
        price: Number(calculatedPrice.toFixed(2)),
      })),
      total: totalAmount,
      status: formData.status,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateOrder(editingId, payload);
        toast.success('Orden actualizada');
      } else {
        await createOrder(payload);
        toast.success('Orden creada');
      }
      setSheetOpen(false);
      loadOrders();
    } catch (err) {
      toast.error('Error al guardar orden');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (order) => {
    const ok = await confirmAction({
      title: `¿Eliminar la orden #${shortId(order)}?`,
      description: 'Esta acción no se puede deshacer.',
    });
    if (!ok) return;
    try {
      await deleteOrder(entityId(order));
      toast.success('Orden eliminada');
      loadOrders();
    } catch (err) {
      toast.error('Error al eliminar orden');
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Orden',
      render: (order) => <span className="mono text-muted">#{shortId(order)}</span>,
    },
    {
      key: 'customer',
      header: 'Cliente',
      render: (order) => (
        <div>
          <p className="table__primary">{order.customerName || '—'}</p>
          {Array.isArray(order.items) && order.items.length > 0 && (
            <p className="table__secondary truncate" style={{ maxWidth: 260 }}>
              {order.items.map((i) => i.name).join(', ')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'restaurant',
      header: 'Restaurante',
      render: (order) => <span className="text-muted nowrap">{restaurantName(order.restaurantId, restaurants)}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (order) => {
        const s = statusOf(ORDER_STATUS, order.status);
        return <Badge tone={s.tone}>{s.label}</Badge>;
      },
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (order) => <span className="tabular nowrap table__primary">{formatMoney(order.total)}</span>,
    },
    {
      key: 'actions',
      header: <span className="visually-hidden">Acciones</span>,
      align: 'right',
      width: 96,
      render: (order) => (
        <RowActions label={`orden ${shortId(order)}`} onEdit={() => handleEdit(order)} onDelete={() => handleDelete(order)} />
      ),
    },
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow="Operación"
        title="Órdenes"
        description="Pedidos de todos los restaurantes y su estado actual."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nueva orden
          </Button>
        }
      />

      <div className="stack" style={{ '--gap': '12px' }}>
        <SegmentedControl label="Filtrar órdenes" options={FILTERS} value={filter} onChange={setFilter} />
        <Toolbar meta={!loading && !error ? `${filtered.length} órdenes` : null}>
          <SearchField value={search} onChange={setSearch} placeholder="Buscar por cliente o ID" />
        </Toolbar>
      </div>

      <TableCard
        loading={loading}
        error={error}
        onRetry={loadOrders}
        rows={filtered}
        columns={columns}
        caption="Órdenes"
        empty={{
          icon: ShoppingBag,
          title: search || filter !== 'all' ? 'Sin resultados' : 'Aún no hay órdenes',
          description: search || filter !== 'all' ? 'Prueba con otro filtro.' : 'Las órdenes nuevas aparecerán aquí.',
        }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar orden' : 'Nueva orden'}
        description="El total se reparte entre los artículos indicados."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving}>
              {editingId ? 'Guardar cambios' : 'Crear orden'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="stack" onSubmit={handleSubmit}>
          <Field label="Restaurante" hint={restaurantsLoading ? 'Cargando restaurantes…' : undefined}>
            {(a11y) => (
              <Select {...a11y} value={formData.restaurantId} onChange={set('restaurantId')} disabled={restaurantsLoading}>
                <option value="">Selecciona un restaurante</option>
                {restaurants.map((r) => (
                  <option key={entityId(r)} value={entityId(r)}>
                    {r.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Cliente">
            {(a11y) => <Input {...a11y} value={formData.customerName} onChange={set('customerName')} placeholder="Nombre del cliente" />}
          </Field>
          <Field label="Artículos" hint="Separa los artículos con coma o salto de línea.">
            {(a11y) => <Textarea {...a11y} value={formData.items} onChange={set('items')} placeholder="Pepián, Horchata, Rellenitos" />}
          </Field>
          <div className="grid-2">
            <Field label="Total">
              {(a11y) => (
                <Input {...a11y} type="number" inputMode="decimal" step="0.01" min="0" value={formData.total} onChange={set('total')} placeholder="0.00" />
              )}
            </Field>
            <Field label="Estado">
              {(a11y) => (
                <Select {...a11y} value={formData.status} onChange={set('status')}>
                  {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </form>
      </Sheet>
    </Layout>
  );
};
