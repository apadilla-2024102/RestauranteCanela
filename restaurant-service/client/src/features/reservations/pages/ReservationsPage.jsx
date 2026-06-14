import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from '../../../shared/api/reservationsApi.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });

  useEffect(() => {
    loadReservations();
    loadRestaurants();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar reservaciones');
      console.error(error);
    } finally {
      setLoading(false);
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
    if (!formData.restaurantId || !formData.customerName || !formData.email || !formData.date || !formData.time || !formData.guests) {
      toast.error('ID de restaurante, nombre, email, fecha, hora y número de personas son requeridos');
      return;
    }

    const payload = {
      restaurantId: formData.restaurantId,
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests),
    };

    try {
      if (editingId) {
        await updateReservation(editingId, payload);
        toast.success('Reservación actualizada');
      } else {
        await createReservation(payload);
        toast.success('Reservación creada');
      }
      setFormData({
        restaurantId: '',
        customerName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
      });
      setEditingId(null);
      setShowForm(false);
      loadReservations();
    } catch (error) {
      toast.error('Error al guardar reservación');
      console.error(error);
    }
  };

  const handleEdit = (reservation) => {
    setFormData({
      restaurantId: reservation.restaurantId?._id || reservation.restaurantId || '',
      customerName: reservation.customerName || '',
      email: reservation.email || '',
      phone: reservation.phone || '',
      date: reservation.date || '',
      time: reservation.time || '',
      guests: reservation.guests || '',
    });
    setEditingId(reservation.id || reservation._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta reservación?')) return;
    try {
      await deleteReservation(id);
      toast.success('Reservación eliminada');
      loadReservations();
    } catch (error) {
      toast.error('Error al eliminar reservación');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservaciones</h1>
            <p className="text-gray-600">Gestiona las reservaciones del restaurante</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                restaurantId: '',
                customerName: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                guests: '',
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Reservación'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Reservación' : 'Nueva Reservación'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del Cliente"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-xs text-red-500 mt-1">No se encontraron restaurantes. Crea uno primero.</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Elige el restaurante desde la lista para evitar copiar IDs.</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Número de Personas"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
        ) : reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay reservaciones</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Restaurante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Personas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{res.customerName}</p>
                        <p className="text-sm text-gray-500">{res.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{res.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {res.restaurantId?.name || res.restaurantId || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {res.date} {res.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{res.guests}</td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(res)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
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
