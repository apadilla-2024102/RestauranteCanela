const BASE_URL = import.meta.env.VITE_MENU_API_URL || 'http://localhost:3005/api/v1';

const getAuthHeaders = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('restaurant_canela_auth'));
    return auth?.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

const normalizeEntity = (entity) => {
  if (!entity || typeof entity !== 'object') return entity;
  if (Array.isArray(entity)) {
    return entity.map(normalizeEntity);
  }
  return { ...entity, id: entity.id || entity._id };
};

const handleResponse = async (response) => {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message || 'Error en la comunicación con el servidor');
  }
  return normalizeEntity(body.data ?? body);
};

// Menu Items
export const getAllMenuItems = async () => {
  const response = await fetch(`${BASE_URL}/menu`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
};

export const createMenuItem = async (payload) => {
  const response = await fetch(`${BASE_URL}/menu`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateMenuItem = async (id, payload) => {
  const response = await fetch(`${BASE_URL}/menu/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const uploadMenuImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${BASE_URL}/menu/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  return handleResponse(response);
};

export const deleteMenuItem = async (id) => {
  const response = await fetch(`${BASE_URL}/menu/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
};
