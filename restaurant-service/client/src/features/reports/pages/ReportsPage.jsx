import { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { Plus, X, Edit3, Trash2, DollarSign, BarChart3, ShoppingCart, CalendarCheck2, CreditCard, Users, Box } from 'lucide-react';
import { getAllReports, createReport, updateReport, deleteReport } from '../../../shared/api/reportsApi.js';
import { getAllPayments } from '../../../shared/api/paymentsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [salesTotal, setSalesTotal] = useState(null);
  const [salesLoading, setSalesLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'sales',
    title: '',
    description: '',
    restaurantId: '',
    startDate: '',
    endDate: '',
    generatedBy: 'Sistema',
  });

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
    } catch (error) {
      toast.error('Error al cargar reportes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      const list = Array.isArray(data) ? data : [];
      setRestaurants(list);
      if (!formData.restaurantId && list.length > 0) {
        setFormData((current) => ({ ...current, restaurantId: list[0].id || list[0]._id }));
      }
    } catch (error) {
      console.error('Error al cargar restaurantes:', error);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const loadSalesTotals = async () => {
    try {
      setSalesLoading(true);
      const payments = await getAllPayments();
      const list = Array.isArray(payments) ? payments : [];
      const total = list.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      setSalesTotal(total);
    } catch (error) {
      console.error('Error al cargar totales de ventas:', error);
      setSalesTotal(null);
    } finally {
      setSalesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurantId || !formData.title || !formData.startDate || !formData.endDate) {
      toast.error('ID del restaurante, título y rango de fechas son requeridos');
      return;
    }

    let reportData = {
      summary: formData.description || `Reporte de ${formData.type}`,
    };

    if (formData.type === 'sales') {
      try {
        const payments = await getAllPayments();
        const list = Array.isArray(payments) ? payments : [];
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        end.setHours(23, 59, 59, 999);

        const filtered = list.filter((payment) => {
          const matchesRestaurant = payment.restaurantId == formData.restaurantId || payment.restaurantId?._id == formData.restaurantId;
          const createdAt = payment.createdAt ? new Date(payment.createdAt) : null;
          const withinRange = createdAt ? createdAt >= start && createdAt <= end : true;
          return matchesRestaurant && withinRange;
        });

        const totalSales = filtered.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
        const totalOrders = filtered.length;
        const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

        reportData = {
          summary: formData.description || `Ventas de ${formData.startDate} a ${formData.endDate}`,
          totalSales,
          totalRevenue: totalSales,
          totalOrders,
          averageOrderValue: Number(averageOrderValue.toFixed(2)),
        };
      } catch (error) {
        console.error('Error calculando reporte de ventas:', error);
      }
    }

    const payload = {
      restaurantId: formData.restaurantId,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      generatedBy: formData.generatedBy,
      data: reportData,
      dateRange: {
        start: formData.startDate,
        end: formData.endDate,
      },
    };

    try {
      if (editingId) {
        await updateReport(editingId, payload);
        toast.success('Reporte actualizado');
      } else {
        await createReport(payload);
        toast.success('Reporte creado');
      }
      setFormData({ type: 'sales', title: '', description: '', restaurantId: '', startDate: '', endDate: '', generatedBy: 'Sistema' });
      setEditingId(null);
      setShowForm(false);
      loadReports();
    } catch (error) {
      toast.error('Error al guardar reporte');
      console.error(error);
    }
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
    setEditingId(report.id || report._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este reporte?')) return;
    try {
      await deleteReport(id);
      toast.success('Reporte eliminado');
      loadReports();
    } catch (error) {
      toast.error('Error al eliminar reporte');
    }
  };

  const renderReportData = (data) => {
    if (!data || typeof data !== 'object') return null;

    const labels = {
      totalSales: 'Total ventas',
      totalRevenue: 'Total ingresos',
      totalOrders: 'Órdenes',
      averageOrderValue: 'Ticket promedio',
      total: 'Total',
      sales: 'Ventas',
      revenue: 'Ingresos',
      summary: 'Resumen',
    };

    const entries = [];
    Object.entries(labels).forEach(([key, label]) => {
      if (data[key] != null && key !== 'summary') {
        entries.push(
          <p key={key} className="text-sm text-gray-700">
            {label}: {String(data[key])}
          </p>
        );
      }
    });

    Object.entries(data).forEach(([key, value]) => {
      if (!Object.keys(labels).includes(key) && value != null) {
        entries.push(
          <p key={key} className="text-xs text-slate-500 break-words">
            {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </p>
        );
      }
    });

    return entries.length ? <div className="mt-3 space-y-1">{entries}</div> : null;
  };

  const typeIcons = {
    sales: <DollarSign className="h-6 w-6 text-slate-700" />,
    revenue: <BarChart3 className="h-6 w-6 text-slate-700" />,
    orders: <ShoppingCart className="h-6 w-6 text-slate-700" />,
    reservations: <CalendarCheck2 className="h-6 w-6 text-slate-700" />,
    payments: <CreditCard className="h-6 w-6 text-slate-700" />,
    customers: <Users className="h-6 w-6 text-slate-700" />,
    inventory: <Box className="h-6 w-6 text-slate-700" />,
  };

  const typeLabels = {
    sales: 'Ventas',
    revenue: 'Ingresos',
    orders: 'Órdenes',
    reservations: 'Reservaciones',
    payments: 'Pagos',
    customers: 'Clientes',
    inventory: 'Inventario',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600">Gestiona los reportes del restaurante</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ type: 'sales', title: '', description: '', restaurantId: '', startDate: '', endDate: '', generatedBy: 'Sistema' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            {showForm ? <><X className="h-4 w-4" /> Cancelar</> : <><Plus className="h-4 w-4" /> Nuevo Reporte</>}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Reporte' : 'Nuevo Reporte'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sales">Ventas</option>
                  <option value="revenue">Ingresos</option>
                  <option value="orders">Órdenes</option>
                  <option value="reservations">Reservaciones</option>
                  <option value="payments">Pagos</option>
                  <option value="inventory">Inventario</option>
                  <option value="customers">Clientes</option>
                </select>
                <div>
                  <select
                    value={formData.restaurantId}
                    onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un restaurante</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id || restaurant._id} value={restaurant.id || restaurant._id}>
                        {restaurant.name || restaurant.id || restaurant._id}
                      </option>
                    ))}
                  </select>
                  {restaurantsLoading ? (
                    <p className="text-xs text-gray-500 mt-1">Cargando restaurantes...</p>
                  ) : restaurants.length === 0 ? (
                    <p className="text-xs text-red-500 mt-1">No hay restaurantes disponibles.</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Selecciona un restaurante para este reporte.</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {editingId ? 'Guardar Cambios' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {salesLoading ? (
          <div className="text-sm text-gray-500 mb-4">Cargando ventas...</div>
        ) : salesTotal !== null ? (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Total real de ventas registradas: ${salesTotal.toFixed(2)}
          </div>
        ) : null}

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay reportes</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl text-slate-700">{typeIcons[report.type] || <BarChart3 className="h-6 w-6" />}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{report.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{typeLabels[report.type] || report.type}</p>
                      {report.restaurantId && (
                        <p className="text-xs text-gray-500 mt-1">Restaurante: {report.restaurantId.name || report.restaurantId}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(report)}
                      className="text-blue-600 hover:text-blue-900 text-sm flex items-center gap-1"
                    >
                      <Edit3 className="h-4 w-4" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(report.id || report._id)}
                      className="text-red-600 hover:text-red-900 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {report.description || report.data?.summary ||
                    (report.data?.totalSales != null ? `Ventas: ${report.data.totalSales}` :
                    report.data?.total != null ? `Ventas: ${report.data.total}` :
                    'Resumen no disponible')}
                </p>
                {renderReportData(report.data)}
                {report.createdAt && (
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
