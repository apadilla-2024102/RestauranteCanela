import { Phone } from 'lucide-react';
import { Field, Input, Textarea } from '../../../shared/components/ui/Field.jsx';
import { ImageDropzone } from '../../../shared/components/ui/ImageDropzone.jsx';

export const EMPTY_RESTAURANT = { name: '', address: '', description: '', phone: '', imageUrl: '' };

/** Formulario controlado; el envío lo dispara el footer del Sheet vía `form={id}`. */
export const RestaurantForm = ({ id, value, onChange, onSubmit, imagePreview, uploading, onImageSelect, onImageClear }) => {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  return (
    <form id={id} className="stack" onSubmit={onSubmit}>
      <Field label="Nombre">
        {(a11y) => <Input {...a11y} value={value.name} onChange={set('name')} placeholder="Canela Zona 10" autoFocus />}
      </Field>
      <Field label="Dirección">
        {(a11y) => <Input {...a11y} value={value.address} onChange={set('address')} placeholder="Calle, número, ciudad" />}
      </Field>
      <Field label="Teléfono">
        {(a11y) => (
          <Input
            {...a11y}
            type="tel"
            value={value.phone}
            onChange={set('phone')}
            placeholder="+502 1234 5678"
            leading={<Phone size={16} />}
          />
        )}
      </Field>
      <Field label="Descripción" hint="Una frase corta sobre el ambiente o la especialidad.">
        {(a11y) => <Textarea {...a11y} value={value.description} onChange={set('description')} />}
      </Field>
      <ImageDropzone
        label="Imagen de portada"
        preview={imagePreview}
        uploading={uploading}
        onSelect={onImageSelect}
        onClear={onImageClear}
      />
    </form>
  );
};
