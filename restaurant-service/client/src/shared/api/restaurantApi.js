import { MOCK_RESTAURANTS } from './mockData.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5501/api/v1';

const getAuthHeaders = () => {
  // Nota: Esta función debe ser llamada desde un componente que tenga acceso al contexto
  // Por ahora, obtendremos el token directamente del localStorage
  try {
    const auth = JSON.parse(localStorage.getItem('restaurant_canela_auth'));
    return auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

const normalizeEntity = (entity) => {
  if (!entity || typeof entity !== 'object') return entity;
  if (Array.isArray(entity)) return entity.map(normalizeEntity);
  return { ...entity, id: entity.id || entity._id };
};

const handleResponse = async (response) => {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || 'Error en la comunicación con el servidor');
  }
  return normalizeEntity(body.data ?? body);
};

export const getAllRestaurants = async () => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    
    // Si es error, lanza excepción para caer al catch
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return handleResponse(response);
  } catch (error) {
    console.warn('Restaurants API unavailable, using mock data:', error.message);
    return MOCK_RESTAURANTS;
  }
};

export const createRestaurant = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Create restaurant failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updateRestaurant = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Update restaurant failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const uploadRestaurantImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${BASE_URL}/restaurants/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Upload image failed:', error.message);
    return { url: URL.createObjectURL(file) };
  }
};

export const deleteRestaurant = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Delete restaurant failed:', error.message);
    return { id, deleted: true };
  }
};
