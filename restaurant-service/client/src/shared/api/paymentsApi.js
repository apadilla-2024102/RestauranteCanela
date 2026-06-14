const BASE_URL = import.meta.env.VITE_PAYMENTS_API_URL || 'http://localhost:5300/api/v1';

import { MOCK_PAYMENTS } from './mockData.js';

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

// Payments
export const getAllPayments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/payments`, {
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
    console.warn('Payments API unavailable, using mock data:', error.message);
    return MOCK_PAYMENTS;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Get payment failed, using mock:', error.message);
    return MOCK_PAYMENTS.find(p => p.id === id) || {};
  }
};

export const createPayment = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Create payment failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updatePayment = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Update payment failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Delete payment failed:', error.message);
    return { id, deleted: true };
  }
};
