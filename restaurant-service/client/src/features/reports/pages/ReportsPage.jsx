import { useEffect, useState } from 'react';
import { LineChart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../shared/components/ui/EmptyState.jsx';
import { NumberTicker } from '../../../shared/components/ui/NumberTicker.jsx';
import { Field, Input, Select, Textarea } from '../../../shared/components/ui/Field.jsx';
import { ReportCard, REPORT_TYPES } from '../components/ReportCard.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import { formatMoney, entityId } from '../../../shared/lib/format.js';
import { getAllReports, createReport, updateReport, deleteReport } from '../../../shared/api/reportsApi.js';
import { getAllPayments } from '../../../shared/api/paymentsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';

const FORM_ID = 'report-form';
const EMPTY = { type: 'sales', title: '', description: '', restaurantId: '', startDate: '', endDate: '', generatedBy: 'Sistema' };

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [salesTotal, setSalesTotal] = useState(null);
  const [salesLoading, setSalesLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    loadReports();
    loadSalesTotals();
    loadRestaurants();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error al cargar reportes');
      toast.error('Error al cargar reportes');
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
      console.error('Error al cargar restaurantes:', err);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const loadSalesTotals = async () => {
    try {
      setSalesLoading(true);
      const payments = await getAllPayments();
      const list = Array.isArray(payments) ? payments : [];
      setSalesTotal(list.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0));
    } catch (err) {
      console.error('Error al cargar totales de ventas:', err);
      setSalesTotal(null);
    } finally {
      setSalesLoading(false);
    }
  };

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setFormData({ ...EMPTY, restaurantId: restaurants[0] ? entityId(restaurants[0]) : '' });
    setSheetOpen(true);
  };

  const handleEdit = (report) => {
    setFormData({
      type: report.type || 'sales',
      title: report.title || '',
      description: report.description || '',
      restaurantId: report.restaurantId?._id || report.restaurantId || '',
      startDate: report.dateRange?.start ? new Date(report.dateRange.start).toISOString().slice(0, 10) : '',
      endDate: report.dateRange?.end ? new Date(report.dateRange.end).toISOString().slice(0, 10) : '',
      generatedBy: report.generatedBy || 'Sistema',
    });
    setEditingId(entityId(report));
    setSheetOpen(true);
  };

  const buildSalesData = async () => {
    const payments = await getAllPayments();
    const list = Array.isArray(payments) ? payments : [];
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = list.filter((payment) => {
      const matchesRestaurant =
        payment.restaurantId == formData.restaurantId || payment.restaurantId?._id == formData.restaurantId;
      const createdAt = payment.createdAt ? new Date(payment.createdAt) : null;
      const withinRange = createdAt ? createdAt >= start && createdAt <= end : true;
      return matchesRestaurant && withinRange;
    });

    const totalSales = filtered.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalOrders = filtered.length;
    const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

    return {
      summary: formData.description || `Ventas de ${formData.startDate} a ${formData.endDate}`,
      totalSales,
      totalRevenue: totalSales,
      totalOrders,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurantId || !formData.title || !formData.startDate || !formData.endDate) {
      toast.error('Restaurante, título y rango de fechas son requeridos');
      return;
    }

    setSaving(true);
    let reportData = { summary: formData.description || `Reporte de ${formData.type}` };
    if (formData.type === 'sales') {
      try {
        reportData = await buildSalesData();
      } catch (err) {
        console.error('Error calculando reporte de ventas:', err);
      }
    }

    const payload = {
      restaurantId: formData.restaurantId,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      generatedBy: formData.generatedBy,
      data: reportData,
      dateRange: { start: formData.startDate, end: formData.endDate },
    };

    try {
      if (editingId) {
        await updateReport(editingId, payload);
        toast.success('Reporte actualizado');
      } else {
        await createReport(payload);
        toast.success('Reporte creado');
      }
      setSheetOpen(false);
      loadReports();
    } catch (err) {
      toast.error('Error al guardar reporte');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (report) => {
    const ok = await confirmAction({ title: `¿Eliminar “${report.title}”?`, description: 'Esta acción no se puede deshacer.' });
    if (!ok) return;
    try {
      await deleteReport(entityId(report));
      toast.success('Reporte eliminado');
      loadReports();
    } catch (err) {
      toast.error('Error al eliminar reporte');
    }
  };

  const renderReports = () => {
    if (loading) {
      return (
        <div className="report-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="stack" style={{ '--gap': '12px' }}>
              <Skeleton width="50%" height={16} />
              <Skeleton width="80%" />
              <Skeleton height={56} />
            </Card>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <Card>
          <ErrorState message={error} onRetry={loadReports} />
        </Card>
      );
    }
    if (reports.length === 0) {
      return (
        <Card>
          <EmptyState
            icon={LineChart}
            title="Aún no hay reportes"
            description="Genera un reporte de ventas para ver totales, órdenes y ticket promedio."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus /> Nuevo reporte
              </Button>
            }
          />
        </Card>
      );
    }
    return (
      <div className="report-grid">
        {reports.map((report, index) => (
          <ReportCard
            key={entityId(report)}
            report={report}
            restaurants={restaurants}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Finanzas"
        title="Reportes"
        description="Resúmenes de ventas y operación por restaurante."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nuevo reporte
          </Button>
        }
      />

      <div className="summary-strip">
        <div className="summary-strip__item">
          <span className="summary-strip__label">Ventas registradas</span>
          <span className="summary-strip__value">
            {salesLoading ? (
              <Skeleton width={120} height={28} />
            ) : salesTotal !== null ? (
              <NumberTicker value={salesTotal} format={formatMoney} />
            ) : (
              '—'
            )}
          </span>
        </div>
        <div className="summary-strip__item">
          <span className="summary-strip__label">Reportes generados</span>
          <span className="summary-strip__value">
            {loading ? <Skeleton width={40} height={28} /> : <NumberTicker value={reports.length} />}
          </span>
        </div>
      </div>

      {renderReports()}

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar reporte' : 'Nuevo reporte'}
        description="Los reportes de ventas calculan totales a partir de los pagos del rango."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving}>
              {editingId ? 'Guardar cambios' : 'Generar reporte'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="stack" onSubmit={handleSubmit}>
          <Field label="Título">
            {(a11y) => <Input {...a11y} value={formData.title} onChange={set('title')} placeholder="Ventas de noviembre" />}
          </Field>
          <div className="grid-2">
            <Field label="Tipo">
              {(a11y) => (
                <Select {...a11y} value={formData.type} onChange={set('type')}>
                  {Object.entries(REPORT_TYPES).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field
              label="Restaurante"
              hint={restaurantsLoading ? 'Cargando…' : restaurants.length === 0 ? 'No hay restaurantes.' : undefined}
            >
              {(a11y) => (
                <Select {...a11y} value={formData.restaurantId} onChange={set('restaurantId')} disabled={restaurantsLoading}>
                  <option value="">Selecciona</option>
                  {restaurants.map((r) => (
                    <option key={entityId(r)} value={entityId(r)}>
                      {r.name || entityId(r)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div className="grid-2">
            <Field label="Desde">{(a11y) => <Input {...a11y} type="date" value={formData.startDate} onChange={set('startDate')} />}</Field>
            <Field label="Hasta">{(a11y) => <Input {...a11y} type="date" value={formData.endDate} onChange={set('endDate')} />}</Field>
          </div>
          <Field label="Descripción">
            {(a11y) => <Textarea {...a11y} rows={4} value={formData.description} onChange={set('description')} />}
          </Field>
        </form>
      </Sheet>
    </Layout>
  );
};
