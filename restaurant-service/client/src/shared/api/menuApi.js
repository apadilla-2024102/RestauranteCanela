const BASE_URL = import.meta.env.VITE_MENU_API_URL || 'http://localhost:3005/api/v1';

import { MOCK_MENU_ITEMS } from './mockData.js';

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
  try {
    const response = await fetch(`${BASE_URL}/menu`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return handleResponse(response);
  } catch (error) {
    console.warn('Menu API unavailable, using mock data:', error.message);
    return MOCK_MENU_ITEMS;
  }
};

export const createMenuItem = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Create menu item failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updateMenuItem = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Update menu item failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const uploadMenuImage = async (file) => {
  try {
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
  } catch (error) {
    console.warn('Upload menu image failed:', error.message);
    return { url: URL.createObjectURL(file) };
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Delete menu item failed:', error.message);
    return { id, deleted: true };
  }
};
