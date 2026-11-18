import { useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Field, Input } from '../../../shared/components/ui/Field.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';

export const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const canSubmit = useMemo(() => form.email.trim() !== '' && form.password.trim() !== '', [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    try {
      setSubmitting(true);
      setError('');
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setAttempt((n) => n + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <Field label="Correo o usuario">
        {(a11y) => (
          <Input
            {...a11y}
            name="email"
            type="text"
            autoComplete="username"
            autoFocus
            value={form.email}
            onChange={handleChange}
            placeholder="hola@canela.com"
            leading={<Mail size={16} />}
          />
        )}
      </Field>

      <Field label="Contraseña">
        {(a11y) => (
          <div className="password-input">
            <Input
              {...a11y}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              leading={<Lock size={16} />}
            />
            <button
              type="button"
              className="password-input__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}
      </Field>

      {error && (
        <p key={attempt} className="login-form__error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" block loading={submitting} disabled={!canSubmit}>
        Ingresar <ArrowRight />
      </Button>
    </form>
  );
};
