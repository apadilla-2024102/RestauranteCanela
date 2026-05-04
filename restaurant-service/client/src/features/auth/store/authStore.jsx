import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser, getUserProfile } from '../../../shared/api/authApi.js';

const AUTH_STORAGE_KEY = 'restaurant_canela_auth';
const AuthContext = createContext(null);

const getSavedAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = getSavedAuth();
    if (savedAuth?.token) {
      setToken(savedAuth.token);
      // Intentar obtener el perfil del usuario con el token guardado
      getUserProfile(savedAuth.token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token inválido, limpiar
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    const authData = await loginUser({ emailOrUsername: email, password });
    const userPayload = authData.user ?? authData.userDetails ?? authData.userInfo ?? {};

    const userData = {
      id: userPayload.id ?? authData.userId ?? '',
      email: userPayload.email ?? email,
      name: userPayload.name ?? userPayload.username ?? email.split('@')[0],
      role: userPayload.role ?? 'USER',
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      token: authData.token,
      user: userData,
    }));

    setToken(authData.token);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const result = await registerUser(userData);
    return result;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
