import { useId, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Spinner } from './Spinner.jsx';

/** Zona para soltar o elegir una imagen, con vista previa. */
export const ImageDropzone = ({ preview, uploading, onSelect, onClear, label = 'Imagen' }) => {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      {preview ? (
        <div className="dropzone-preview">
          <img src={preview} alt="Vista previa" />
          {uploading && (
            <div className="dropzone-preview__loading">
              <Spinner size={18} />
            </div>
          )}
          {onClear && !uploading && (
            <button type="button" className="dropzone-preview__clear" onClick={onClear} aria-label="Quitar imagen">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="dropzone"
          data-dragging={dragging || undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {uploading ? <Spinner size={18} /> : <ImagePlus size={20} />}
          <span className="dropzone__title">{uploading ? 'Subiendo…' : 'Arrastra una imagen o haz clic'}</span>
          <span className="dropzone__hint">PNG, JPG o WEBP</span>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};
