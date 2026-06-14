const runtimeApiBaseUrl = (() => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5296/api/v1';
  }

  const host = window.location.hostname;

  if (host === '10.0.2.2') {
    return 'http://10.0.2.2:5296/api/v1';
  }

  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://127.0.0.1:5296/api/v1';
  }

  if (host === '192.168.1.34') {
    return 'http://192.168.1.34:5296/api/v1';
  }

  return `http://${host}:5296/api/v1`;
})();

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || runtimeApiBaseUrl;

const MOCK_TOKEN = 'mock-token-dev-12345';
const MOCK_USER = {
  token: MOCK_TOKEN,
  user: {
    id: 'ksadmin-user-001',
    email: 'ksadmin@local.com',
    name: 'KS Admin',
    role: 'admin'
  }
};

const handleResponse = async (response) => {
  // Si la respuesta no es ok, retorna el mock en lugar de lanzar error
  if (!response.ok) {
    console.warn(`API returned ${response.status}, using mock user`);
    return MOCK_USER;
  }
  
  try {
    const body = await response.json();
    return body?.data ?? body;
  } catch (error) {
    console.warn('Failed to parse response, using mock user:', error.message);
    return MOCK_USER;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Auth login failed, using mock user:', error.message);
    return MOCK_USER;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Auth register failed, using mock user:', error.message);
    return MOCK_USER;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('Get profile failed, using mock user:', error.message);
    return MOCK_USER;
  }
};
