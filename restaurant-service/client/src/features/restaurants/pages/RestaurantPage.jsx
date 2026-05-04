import { useEffect, useMemo, useState } from 'react';
import { Plus, X, Phone, Edit3, Trash2, MapPin, Search } from 'lucide-react';
import { Layout } from '../../../shared/components/Layout.jsx';
import { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../../shared/api/restaurantApi.js';
import toast from 'react-hot-toast';

export const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    phone: '',
  });

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const term = search.toLowerCase().trim();
      return (
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.address.toLowerCase().includes(term) ||
        restaurant.description.toLowerCase().includes(term)
      );
    });
  }, [restaurants, search]);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('No se pudieron cargar los restaurantes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      if (editingId) {
        await updateRestaurant(editingId, formData);
        toast.success('Restaurante actualizado');
      } else {
        await createRestaurant(formData);
        toast.success('Restaurante agregado');
      }
      setFormData({ name: '', address: '', description: '', phone: '' });
      setEditingId(null);
      setShowForm(false);
      loadRestaurants();
    } catch (error) {
      toast.error(error.message || 'Error al guardar el restaurante');
    }
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name || '',
      address: restaurant.address || '',
      description: restaurant.description || '',
      phone: restaurant.phone || '',
    });
    setEditingId(restaurant.id || restaurant._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este restaurante?')) return;
    try {
      await deleteRestaurant(id);
      toast.success('Restaurante eliminado');
      loadRestaurants();
    } catch (error) {
      toast.error('Error al eliminar el restaurante');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurantes</h1>
            <p className="text-gray-600">Gestiona los restaurantes con un estilo profesional.</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', address: '', description: '', phone: '' });
            }}
            className="btn btn--primary"
          >
            {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo restaurante</>}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow p-5 border border-slate-200/80">
          <div className="flex items-center gap-3 px-4 py-3 rounded-3xl bg-slate-50">
            <Search size={18} className="text-slate-500" />
            <input
              type="search"
              placeholder="Buscar por nombre, dirección o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-slate-800"
            />
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-3xl shadow p-6 border border-slate-200/90">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 px-4 py-3 border rounded-2xl">
                  <Phone size={18} className="text-red-500" />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn--primary">
                {editingId ? 'Guardar cambios' : 'Crear restaurante'}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay restaurantes</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id || restaurant._id} className="restaurant-card">
                <div className="restaurant-card__header">
                  <div>
                    <span className={`status ${restaurant.isActive ? 'status--active' : 'status--inactive'}`}>
                      {restaurant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <h3>{restaurant.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    {restaurant.openingHours || 'Horario no disponible'}
                  </p>
                </div>

                <p className="restaurant-card__description">{restaurant.description || 'Descripción no disponible'}</p>

                <div className="restaurant-card__info">
                  <div>
                    <span className="text-sm text-slate-500">Dirección</span>
                    <strong>{restaurant.address || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Contacto</span>
                    <strong>{restaurant.phone || '—'} · {restaurant.email || '—'}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end mt-6">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="btn btn--secondary"
                  >
                    <Edit3 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id || restaurant._id)}
                    className="btn btn--ghost text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
