import { forwardRef } from 'react';
import { Spinner } from './Spinner.jsx';

/**
 * Botón base. Variantes: primary | accent | secondary | ghost | danger.
 * Tamaños: md (default) | sm. `icon` lo vuelve cuadrado.
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon = false,
    block = false,
    loading = false,
    className = '',
    type = 'button',
    disabled,
    ...props
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    icon && 'btn--icon',
    block && 'btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      data-loading={loading}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className="btn__content">{children}</span>
      {loading && (
        <span className="btn__spinner">
          <Spinner size={16} />
        </span>
      )}
    </button>
  );
});
