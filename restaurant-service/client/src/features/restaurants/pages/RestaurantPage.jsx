import { useEffect, useMemo, useState } from 'react';
import { Plus, X, Phone, Edit3, Trash2, MapPin, Search } from 'lucide-react';
import { Layout } from '../../../shared/components/Layout.jsx';
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantImage,
} from '../../../shared/api/restaurantApi.js';
import toast from 'react-hot-toast';

export const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantsError, setRestaurantsError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    phone: '',
    imageUrl: '',
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
      setRestaurantsError(null);
    } catch (error) {
      const msg = error?.message || 'No se pudieron cargar los restaurantes.';
      setRestaurantsError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleImageSelect = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const response = await uploadRestaurantImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: response.imageUrl }));
      setImagePreview(URL.createObjectURL(file));
      toast.success('Imagen cargada');
    } catch (error) {
      console.error(error);
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageInputChange = (e) => {
    if (e.target.files?.[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

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
      setFormData({ name: '', address: '', description: '', phone: '', imageUrl: '' });
      setImagePreview('');
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
      imageUrl: restaurant.imageUrl || '',
    });
    setImagePreview(restaurant.imageUrl || '');
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

  const handleCopyId = async (restaurantId) => {
    try {
      await navigator.clipboard.writeText(restaurantId);
      toast.success('ID copiado al portapapeles');
    } catch (error) {
      toast.error('No se pudo copiar el ID');
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
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-dashed border-2 border-slate-300 rounded-2xl p-4 text-center cursor-pointer"
              >
                <p className="text-sm text-slate-500 mb-2">Arrastra tu imagen aquí o selecciona un archivo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageInputChange}
                  className="w-full"
                />
                {isUploadingImage && <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>}
                {imagePreview && (
                  <div className="mt-4 mx-auto w-full max-w-xs overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover rounded-3xl" />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn--primary">
                {editingId ? 'Guardar cambios' : 'Crear restaurante'}
              </button>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : restaurantsError ? (
          <div className="text-center py-8">
            <div className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <div className="font-medium">Error al cargar restaurantes</div>
              <div className="text-sm">{restaurantsError}</div>
              <div className="mt-2">
                <button onClick={loadRestaurants} className="btn btn--primary">Reintentar</button>
              </div>
            </div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay restaurantes</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id || restaurant._id} className="restaurant-card">
                {restaurant.imageUrl && (
                  <div className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-24 object-cover rounded-3xl" />
                  </div>
                )}
                <div className="restaurant-card__header">
                  <div>
                    <span className={`status ${restaurant.isActive ? 'status--active' : 'status--inactive'}`}>
                      {restaurant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <h3>{restaurant.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>ID: {restaurant.id || restaurant._id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(restaurant.id || restaurant._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Copiar ID
                      </button>
                    </div>
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
