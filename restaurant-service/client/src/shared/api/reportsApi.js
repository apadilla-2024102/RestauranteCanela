const BASE_URL = import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:5400/api/v1';

import { MOCK_REPORTS } from './mockData.js';

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

// Reports
export const getAllReports = async () => {
  try {
    const response = await fetch(`${BASE_URL}/reports`, {
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
    console.warn('Reports API unavailable, using mock data:', error.message);
    return MOCK_REPORTS;
  }
};

export const getReportById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/reports/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Get report failed, using mock:', error.message);
    return MOCK_REPORTS;
  }
};

export const createReport = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Create report failed, using mock:', error.message);
    return { id: 'new-' + Date.now(), ...payload };
  }
};

export const updateReport = async (id, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Update report failed, using mock:', error.message);
    return { id, ...payload };
  }
};

export const deleteReport = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.warn('Delete report failed:', error.message);
    return { id, deleted: true };
  }
};
