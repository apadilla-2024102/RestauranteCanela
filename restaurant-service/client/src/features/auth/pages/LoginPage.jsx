import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { LoginForm } from '../components/LoginForm.jsx';
import { PageShell } from '../../../shared/components/layout/PageShell.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (form) => {
    await login(form);
    navigate('/restaurants', { replace: true });
  };

  return (
    <PageShell
      title="Bienvenido a Restaurante Canela"
      subtitle=""
    >
      <div className="login-page">
        <div className="login-page__panel">
          <h2>Iniciar sesión</h2>
          <p>Ingresa tu correo electrónico y contraseña para continuar.</p>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </PageShell>
  );
};
