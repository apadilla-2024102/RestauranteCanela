import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { LoginForm } from '../components/LoginForm.jsx';
import { LoginShowcase } from '../components/LoginShowcase.jsx';
import { Brand } from '../../../shared/components/layout/Brand.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (form) => {
    await login(form);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="login">
      <section className="login__main">
        <Brand />
        <div className="login__content">
          <h1 className="login__title">Bienvenido de nuevo</h1>
          <p className="login__subtitle">Ingresa tus credenciales para gestionar Restaurante Canela.</p>
          <LoginForm onSubmit={handleSubmit} />
        </div>
        <p className="login__footer">© {new Date().getFullYear()} Restaurante Canela</p>
      </section>
      <LoginShowcase />
    </div>
  );
};
