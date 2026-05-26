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
  const response = await fetch(`${BASE_URL}/restaurants`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
};

export const createRestaurant = async (payload) => {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const updateRestaurant = async (id, payload) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const uploadRestaurantImage = async (file) => {
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
};

export const deleteRestaurant = async (id) => {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
};
