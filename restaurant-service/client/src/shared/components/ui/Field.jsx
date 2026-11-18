import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

/** Envoltura de campo: etiqueta, control, pista y error con ids enlazados. */
export const Field = ({ label, hint, error, children, className = '', htmlFor }) => {
  const autoId = useId();
  const id = htmlFor || autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const control =
    typeof children === 'function'
      ? children({ id, 'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined, 'aria-invalid': !!error || undefined })
      : children;

  return (
    <div className={`field ${className}`} data-invalid={!!error || undefined}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {control}
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export const Input = forwardRef(function Input({ className = '', leading, ...props }, ref) {
  if (leading) {
    return (
      <div className={`input-group ${className}`}>
        <span className="input-group__icon">{leading}</span>
        <input ref={ref} className="input input--with-icon" {...props} />
      </div>
    );
  }
  return <input ref={ref} className={`input ${className}`} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className = '', rows = 3, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={`input textarea ${className}`} {...props} />;
});

export const Select = forwardRef(function Select({ className = '', children, ...props }, ref) {
  return (
    <div className={`select ${className}`}>
      <select ref={ref} className="input select__control" {...props}>
        {children}
      </select>
      <ChevronDown className="select__chevron" size={16} aria-hidden="true" />
    </div>
  );
});
