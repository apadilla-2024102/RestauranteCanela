import { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { getAllPayments, createPayment, updatePayment, deletePayment } from '../../../shared/api/paymentsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders } from '../../../shared/api/ordersApi.js';

export const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    restaurantId: '',
    amount: '',
    method: 'credit_card',
    status: 'pending',
  });

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
    } catch (error) {
      toast.error('Error al cargar pagos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar órdenes');
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar restaurantes');
      console.error(error);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.restaurantId || !formData.amount) {
      toast.error('ID de orden, ID de restaurante y monto son requeridos');
      return;
    }

    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editingId) {
        await updatePayment(editingId, payload);
        toast.success('Pago actualizado');
      } else {
        await createPayment(payload);
        toast.success('Pago creado');
      }
      setFormData({ orderId: '', restaurantId: '', amount: '', method: 'credit_card', status: 'pending' });
      setEditingId(null);
      setShowForm(false);
      loadPayments();
    } catch (error) {
      toast.error(error?.message || 'Error al guardar pago');
      console.error(error);
    }
  };

  const handleEdit = (payment) => {
    setFormData({
      orderId: payment.orderId?._id || payment.orderId || '',
      restaurantId: payment.restaurantId?._id || payment.restaurantId || '',
      amount: payment.amount,
      method: payment.method || 'credit_card',
      status: payment.status,
    });
    setEditingId(payment.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este pago?')) return;
    try {
      await deletePayment(id);
      toast.success('Pago eliminado');
      loadPayments();
    } catch (error) {
      toast.error('Error al eliminar pago');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  };

  const methodLabels = {
    credit_card: 'Tarjeta Crédito',
    debit_card: 'Tarjeta Débito',
    cash: 'Efectivo',
    bank_transfer: 'Transferencia',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
            <p className="text-gray-600">Gestiona los pagos de las órdenes</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ orderId: '', restaurantId: '', amount: '', method: 'credit_card', status: 'pending' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Pago'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Pago' : 'Nuevo Pago'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Orden</label>
                  <select
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una orden</option>
                    {orders.map((order) => (
                      <option key={order.id || order._id} value={order.id || order._id}>
                        {order.id || order._id} - {order.status || 'Orden'}
                      </option>
                    ))}
                  </select>
                  {ordersLoading ? (
                    <p className="text-xs text-gray-500 mt-1">Cargando órdenes...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-red-500 mt-1">No hay órdenes disponibles.</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Selecciona una orden válida.</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Restaurante</label>
                  <select
                    value={formData.restaurantId}
                    onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un restaurante</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id || restaurant._id} value={restaurant.id || restaurant._id}>
                        {restaurant.name || restaurant.description || restaurant.id || restaurant._id}
                      </option>
                    ))}
                  </select>
                  {restaurantsLoading ? (
                    <p className="text-xs text-gray-500 mt-1">Cargando restaurantes...</p>
                  ) : restaurants.length === 0 ? (
                    <p className="text-xs text-red-500 mt-1">No hay restaurantes disponibles.</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Selecciona el restaurante correspondiente.</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Monto"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="credit_card">Tarjeta Crédito</option>
                  <option value="debit_card">Tarjeta Débito</option>
                  <option value="cash">Efectivo</option>
                  <option value="bank_transfer">Transferencia</option>
                </select>
              </div>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="completed">Completado</option>
                <option value="failed">Fallido</option>
                <option value="refunded">Reembolsado</option>
              </select>
              <button
                type="submit"
                disabled={ordersLoading || restaurantsLoading || !orders.length || !restaurants.length}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? 'Guardar Cambios' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay pagos</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID de orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Restaurante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {payment.orderId?._id ? payment.orderId._id.slice(0, 8) : payment.orderId?.slice(0, 8) || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.restaurantId?.name || payment.restaurantId || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{methodLabels[payment.method] || payment.method}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status] || statusColors['pending']}`}>
                        {statusLabels[payment.status] || payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};
