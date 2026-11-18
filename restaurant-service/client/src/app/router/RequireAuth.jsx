import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/store/authStore.jsx';
import { Spinner } from '../../shared/components/ui/Spinner.jsx';

export const RequireAuth = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner size={20} label="Verificando sesión" />
        <p>Verificando sesión…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
