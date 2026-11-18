import { useEffect, useMemo, useState } from 'react';
import { Banknote, CreditCard, Landmark, Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { TableCard } from '../../../shared/components/ui/TableCard.jsx';
import { RowActions } from '../../../shared/components/ui/RowActions.jsx';
import { NumberTicker } from '../../../shared/components/ui/NumberTicker.jsx';
import { Field, Input, Select } from '../../../shared/components/ui/Field.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import { formatMoney, shortId, entityId, restaurantName } from '../../../shared/lib/format.js';
import { PAYMENT_STATUS, PAYMENT_METHOD, statusOf } from '../../../shared/lib/status.js';
import { getAllPayments, createPayment, updatePayment, deletePayment } from '../../../shared/api/paymentsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders } from '../../../shared/api/ordersApi.js';

const FORM_ID = 'payment-form';
const EMPTY = { orderId: '', restaurantId: '', amount: '', method: 'credit_card', status: 'pending' };

const METHOD_ICON = {
  credit_card: CreditCard,
  debit_card: CreditCard,
  cash: Banknote,
  bank_transfer: Landmark,
};

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    loadPayments();
    loadOrders();
    loadRestaurants();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error al cargar pagos');
      toast.error('Error al cargar pagos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Error al cargar órdenes');
      console.error(err);
    } finally {
      setOrdersLoading(false);
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

  const summary = useMemo(() => {
    const sum = (list) => list.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    return {
      collected: sum(payments.filter((p) => p.status === 'completed')),
      pending: sum(payments.filter((p) => p.status === 'pending' || p.status === 'processing')),
      count: payments.length,
    };
  }, [payments]);

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setSheetOpen(true);
  };

  const handleEdit = (payment) => {
    setFormData({
      orderId: payment.orderId?._id || payment.orderId || '',
      restaurantId: payment.restaurantId?._id || payment.restaurantId || '',
      amount: payment.amount,
      method: payment.method || 'credit_card',
      status: payment.status,
    });
    setEditingId(entityId(payment));
    setSheetOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.restaurantId || !formData.amount) {
      toast.error('Orden, restaurante y monto son requeridos');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editingId) {
        await updatePayment(editingId, payload);
        toast.success('Pago actualizado');
      } else {
        await createPayment(payload);
        toast.success('Pago creado');
      }
      setSheetOpen(false);
      loadPayments();
    } catch (err) {
      toast.error(err?.message || 'Error al guardar pago');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment) => {
    const ok = await confirmAction({
      title: `¿Eliminar el pago de ${formatMoney(payment.amount)}?`,
      description: 'Esta acción no se puede deshacer.',
    });
    if (!ok) return;
    try {
      await deletePayment(entityId(payment));
      toast.success('Pago eliminado');
      loadPayments();
    } catch (err) {
      toast.error('Error al eliminar pago');
    }
  };

  const columns = [
    {
      key: 'order',
      hideOnMobile: true,
      header: 'Orden',
      render: (p) => <span className="mono text-muted">#{shortId(p.orderId)}</span>,
    },
    {
      key: 'restaurant',
      header: 'Restaurante',
      render: (p) => <span className="nowrap">{restaurantName(p.restaurantId, restaurants)}</span>,
    },
    {
      key: 'method',
      hideOnMobile: true,
      header: 'Método',
      render: (p) => {
        const Icon = METHOD_ICON[p.method] || Wallet;
        return (
          <span className="row text-muted nowrap" style={{ '--gap': '8px' }}>
            <Icon size={15} /> {PAYMENT_METHOD[p.method] || p.method}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => {
        const s = statusOf(PAYMENT_STATUS, p.status);
        return <Badge tone={s.tone}>{s.label}</Badge>;
      },
    },
    {
      key: 'amount',
      header: 'Monto',
      align: 'right',
      render: (p) => <span className="tabular nowrap table__primary">{formatMoney(p.amount)}</span>,
    },
    {
      key: 'actions',
      header: <span className="visually-hidden">Acciones</span>,
      align: 'right',
      width: 96,
      render: (p) => <RowActions label="pago" onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p)} />,
    },
  ];

  const cannotSubmit = ordersLoading || restaurantsLoading || !orders.length || !restaurants.length;

  return (
    <Layout>
      <PageHeader
        eyebrow="Finanzas"
        title="Pagos"
        description="Cobros asociados a cada orden."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nuevo pago
          </Button>
        }
      />

      <div className="summary-strip">
        <div className="summary-strip__item">
          <span className="summary-strip__label">Cobrado</span>
          <span className="summary-strip__value">
            <NumberTicker value={summary.collected} format={formatMoney} />
          </span>
        </div>
        <div className="summary-strip__item">
          <span className="summary-strip__label">Por cobrar</span>
          <span className="summary-strip__value">
            <NumberTicker value={summary.pending} format={formatMoney} />
          </span>
        </div>
        <div className="summary-strip__item">
          <span className="summary-strip__label">Transacciones</span>
          <span className="summary-strip__value">
            <NumberTicker value={summary.count} />
          </span>
        </div>
      </div>

      <TableCard
        loading={loading}
        error={error}
        onRetry={loadPayments}
        rows={payments}
        columns={columns}
        caption="Pagos"
        empty={{ icon: Wallet, title: 'No hay pagos', description: 'Los pagos registrados aparecerán aquí.' }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar pago' : 'Nuevo pago'}
        description="Registra el cobro de una orden."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving} disabled={cannotSubmit}>
              {editingId ? 'Guardar cambios' : 'Registrar pago'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="stack" onSubmit={handleSubmit}>
          <Field
            label="Orden"
            hint={ordersLoading ? 'Cargando órdenes…' : orders.length === 0 ? 'No hay órdenes disponibles.' : undefined}
          >
            {(a11y) => (
              <Select {...a11y} value={formData.orderId} onChange={set('orderId')} disabled={ordersLoading}>
                <option value="">Selecciona una orden</option>
                {orders.map((order) => (
                  <option key={entityId(order)} value={entityId(order)}>
                    #{shortId(order)} · {order.customerName || 'Cliente'} · {formatMoney(order.total)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field
            label="Restaurante"
            hint={restaurantsLoading ? 'Cargando restaurantes…' : restaurants.length === 0 ? 'No hay restaurantes disponibles.' : undefined}
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
          <div className="grid-2">
            <Field label="Monto">
              {(a11y) => (
                <Input {...a11y} type="number" inputMode="decimal" step="0.01" min="0" value={formData.amount} onChange={set('amount')} placeholder="0.00" />
              )}
            </Field>
            <Field label="Método">
              {(a11y) => (
                <Select {...a11y} value={formData.method} onChange={set('method')}>
                  {Object.entries(PAYMENT_METHOD).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Field label="Estado">
            {(a11y) => (
              <Select {...a11y} value={formData.status} onChange={set('status')}>
                {Object.entries(PAYMENT_STATUS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </form>
      </Sheet>
    </Layout>
  );
};
