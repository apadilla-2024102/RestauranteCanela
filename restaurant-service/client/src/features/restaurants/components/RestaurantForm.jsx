import { useMemo, useState } from 'react';

const INITIAL_STATE = {
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  openingHours: '',
};

export const RestaurantForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return form.name.trim() !== '' && form.address.trim() !== '';
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);

    await onSubmit(form);
    setSaving(false);
    setForm(INITIAL_STATE);
  };

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <div className="restaurant-form__grid">
        <label>
          Nombre
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del restaurante"
            required
          />
        </label>
        <label>
          Dirección
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Calle, número, ciudad"
            required
          />
        </label>
        <label>
          Teléfono
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+502 1234 5678"
          />
        </label>
        <label>
          Correo
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contacto@restaurante.com"
          />
        </label>
        <label className="full-width">
          Horario
          <input
            name="openingHours"
            value={form.openingHours}
            onChange={handleChange}
            placeholder="Lun-Vie 08:00 - 21:00"
          />
        </label>
        <label className="full-width">
          Descripción
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Una breve descripción del espacio"
            rows="3"
          />
        </label>
      </div>

      <div className="restaurant-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={!canSubmit || saving}>
          {saving ? 'Guardando...' : 'Guardar restaurante'}
        </button>
      </div>
    </form>
  );
};
