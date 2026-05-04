const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5296/api/v1';

const handleResponse = async (response) => {
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.message || 'Error en la comunicación con el servidor');
  }
  return body?.data ?? body;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

export const registerUser = async (userData) => {
  const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const getUserProfile = async (token) => {
  const response = await fetch(`${AUTH_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};