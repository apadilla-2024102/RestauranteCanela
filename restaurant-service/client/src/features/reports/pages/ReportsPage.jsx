import { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { getAllReports, createReport, updateReport, deleteReport } from '../../../shared/api/reportsApi.js';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'sales',
    title: '',
    description: '',
  });

  useEffect(() => {
    loadReports();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Título es requerido');
      return;
    }

    try {
      if (editingId) {
        await updateReport(editingId, formData);
        toast.success('Reporte actualizado');
      } else {
        await createReport(formData);
        toast.success('Reporte creado');
      }
      setFormData({ type: 'sales', title: '', description: '' });
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
    });
    setEditingId(report.id);
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

  const typeIcons = {
    sales: '💰',
    revenue: '📊',
    orders: '📦',
    customers: '👥',
    inventory: '📦',
  };

  const typeLabels = {
    sales: 'Ventas',
    revenue: 'Ingresos',
    orders: 'Órdenes',
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
              setFormData({ type: 'sales', title: '', description: '' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Reporte'}
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
                  <option value="customers">Clientes</option>
                  <option value="inventory">Inventario</option>
                </select>
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
                    <div className="text-3xl">{typeIcons[report.type] || '📄'}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{report.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{typeLabels[report.type] || report.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(report)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
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
