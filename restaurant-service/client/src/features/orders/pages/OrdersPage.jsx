import { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../../../shared/api/ordersApi.js';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    customerName: '',
    items: '',
    total: '',
    status: 'pending',
  });

  useEffect(() => {
    loadRestaurants();
    loadOrders();
  }, []);

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('No se pudieron cargar los restaurantes');
      console.error(error);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar órdenes');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      items: itemNames.length
        ? itemNames.map((name) => ({
            menuItemId: null,
            name,
            quantity: 1,
            price: Number(calculatedPrice.toFixed(2)),
          }))
        : [],
      total: totalAmount,
      status: formData.status,
    };

    try {
      if (editingId) {
        await updateOrder(editingId, payload);
        toast.success('Orden actualizada');
      } else {
        await createOrder(payload);
        toast.success('Orden creada');
      }
      setFormData({ restaurantId: '', customerName: '', items: '', total: '', status: 'pending' });
      setEditingId(null);
      setShowForm(false);
      loadOrders();
    } catch (error) {
      toast.error('Error al guardar orden');
      console.error(error);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      restaurantId: order.restaurantId?._id || order.restaurantId || '',
      customerName: order.customerName || '',
      items: Array.isArray(order.items) ? order.items.map((item) => item.name).join(', ') : order.items || '',
      total: order.total,
      status: order.status,
    });
    setEditingId(order.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta orden?')) return;
    try {
      await deleteOrder(id);
      toast.success('Orden eliminada');
      loadOrders();
    } catch (error) {
      toast.error('Error al eliminar orden');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-indigo-100 text-indigo-800',
    ready: 'bg-teal-100 text-teal-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    preparing: 'Preparando',
    ready: 'Lista',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
            <p className="text-gray-600">Gestiona las órdenes del restaurante</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ restaurantId: '', items: '', total: '', status: 'pending' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Orden'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Orden' : 'Nueva Orden'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <select
                  value={formData.restaurantId}
                  onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un restaurante</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Artículos (separados por coma o salto de línea)"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Total"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="preparing">Preparando</option>
                  <option value="ready">Lista</option>
                  <option value="delivered">Entregada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
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
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay órdenes</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Restaurante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.restaurantId?.name || order.restaurantId || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors['pending']}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
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
