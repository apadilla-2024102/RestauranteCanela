import { useEffect, useState } from 'react';
import { Layout } from '../../../shared/components/Layout.jsx';
import toast from 'react-hot-toast';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../../../shared/api/menuApi.js';

export const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadRestaurants();
    loadMenuItems();
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

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(Array.isArray(data) ? data : []);
      setMenuError(null);
    } catch (error) {
      const msg = error?.message || 'Error al cargar elementos del menú';
      setMenuError(msg);
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const response = await uploadMenuImage(file);
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
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!formData.restaurantId || !objectIdRegex.test(formData.restaurantId)) {
      toast.error('Selecciona un restaurante válido o ingresa un ID de 24 caracteres hexadecimales');
      return;
    }
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Nombre, precio y categoría son requeridos');
      return;
    }

    const payload = {
      restaurantId: formData.restaurantId,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      imageUrl: formData.imageUrl,
      price: parseFloat(formData.price),
    };

    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success('Elemento del menú actualizado');
      } else {
        await createMenuItem(payload);
        toast.success('Elemento del menú creado');
      }
      setFormData({ restaurantId: '', name: '', description: '', price: '', category: '', imageUrl: '' });
      setImagePreview('');
      setEditingId(null);
      setShowForm(false);
      loadMenuItems();
    } catch (error) {
      toast.error('Error al guardar elemento del menú');
      console.error(error);
    }
  }; 

  const handleEdit = (item) => {
    setFormData({
      restaurantId: item.restaurantId?._id || item.restaurantId || '',
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category || '',
      imageUrl: item.imageUrl || '',
    });
    setImagePreview(item.imageUrl || '');
    setEditingId(item.id || item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este elemento del menú?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Elemento del menú eliminado');
      loadMenuItems();
    } catch (error) {
      toast.error('Error al eliminar elemento del menú');
    }
  }; 

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menú</h1>
            <p className="text-gray-600">Gestiona los elementos del menú</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ restaurantId: '', name: '', description: '', price: '', category: '', imageUrl: '' });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo plato'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar elemento del menú' : 'Nuevo elemento del menú'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {restaurants.length > 0 ? (
                <select
                  value={formData.restaurantId}
                  onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar restaurante</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id || restaurant._id} value={restaurant.id || restaurant._id}>
                      {restaurant.name || restaurant.title || (restaurant.id || restaurant._id)}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="ID del restaurante"
                    value={formData.restaurantId}
                    onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    No hay restaurantes cargados. Crea uno primero o ingresa un ID válido.
                  </p>
                </>
              )}
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Precio"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="appetizer">Entrada</option>
                  <option value="main_course">Plato principal</option>
                  <option value="dessert">Postre</option>
                  <option value="beverage">Bebida</option>
                  <option value="side">Acompañamiento</option>
                </select>
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
                {(imagePreview || formData.imageUrl) && (
                  <div className="mt-4 mx-auto w-40 h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
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
        ) : menuError ? (
          <div className="text-center py-8">
            <div className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <div className="font-medium">Error al cargar el menú</div>
              <div className="text-sm">{menuError}</div>
              <div className="mt-2">
                <button onClick={loadMenuItems} className="px-4 py-2 bg-blue-600 text-white rounded-md">Reintentar</button>
              </div>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay elementos de menú</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.imageUrl ? (
                        <div className="w-20 h-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.category || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id || item._id)}
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
