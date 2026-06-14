const BASE_URL = import.meta.env.VITE_ORDERS_API_URL || 'http://localhost:5200/api/v1';

import { MOCK_ORDERS } from './mockData.js';

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

// Orders
export const getAllOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
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
    console.warn('Orders API unavailable, using mock data:', error.message);
    return MOCK_ORDERS;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Get order failed, using mock:', error.message);
    return MOCK_ORDERS.find(o => o.id === id) || {};
  }
};

export const createOrder = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Create order failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updateOrder = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Update order failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Delete order failed:', error.message);
    return { id, deleted: true };
  }
};
