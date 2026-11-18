import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Control segmentado con indicador que se desliza entre opciones.
 * Usa transform (compositor) y una transición interrumpible, no keyframes.
 */
export const SegmentedControl = ({ options, value, onChange, label }) => {
  const listRef = useRef(null);
  const [indicator, setIndicator] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const active = listRef.current?.querySelector('[data-active="true"]');
      if (active) setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [value, options]);

  return (
    <div className="segmented" role="radiogroup" aria-label={label} ref={listRef}>
      {indicator && (
        <span
          className="segmented__indicator"
          style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
          aria-hidden="true"
        />
      )}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            className="segmented__option"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
