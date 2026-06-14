const BASE_URL = import.meta.env.VITE_RESERVATIONS_API_URL || 'http://localhost:5100/api/v1';

import { MOCK_RESERVATIONS } from './mockData.js';

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

// Reservations
export const getAllReservations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reservations`, {
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
    console.warn('Reservations API unavailable, using mock data:', error.message);
    return MOCK_RESERVATIONS;
  }
};

export const getReservationById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Get reservation failed, using mock:', error.message);
    return MOCK_RESERVATIONS.find(r => r.id === id) || {};
  }
};

export const createReservation = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Create reservation failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updateReservation = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Update reservation failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const deleteReservation = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Delete reservation failed:', error.message);
    return { id, deleted: true };
  }
};
