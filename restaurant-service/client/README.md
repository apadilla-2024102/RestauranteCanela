# Restaurante Canela — Cliente web

Panel de gestión (React 19 + Vite) para restaurantes, menú, órdenes, reservaciones, pagos y reportes.

## Scripts

```bash
pnpm install
pnpm dev       # servidor de desarrollo en http://127.0.0.1:5173
pnpm build     # build de producción en dist/
pnpm preview   # sirve el build
```

Las URLs de los servicios se configuran con variables `VITE_*` (ver `.env.example`).

## Sistema de diseño

Interfaz sobria y precisa: paleta neutra cálida, un único acento (canela), tipografía Geist y
movimiento corto y con propósito.

### Estructura de estilos (`src/shared/styles`)

| Archivo | Contenido |
| --- | --- |
| `tokens.css` | Colores, tipografía, espaciado, radios, sombras, easing (modo claro y oscuro) |
| `base.css` | Reset, tipografía base, foco visible y ajustes móviles |
| `motion.css` | Keyframes compartidos y `prefers-reduced-motion` |
| `utilities.css` | Pocas utilidades de layout (`stack`, `row`, `grid-2`, …) |
| `components/*` | Un archivo por componente de UI |
| `layout.css`, `pages/*` | Shell de la app y estilos por página |

### Componentes (`src/shared/components/ui`)

`Button`, `Field` / `Input` / `Textarea` / `Select`, `Card`, `Badge`, `Skeleton`,
`EmptyState` / `ErrorState`, `PageHeader`, `SearchField` / `Toolbar`, `SegmentedControl`,
`DataTable`, `TableCard`, `RowActions`, `Sheet` (Vaul), `ImageDropzone`, `NumberTicker`,
`Toaster` (Sonner).

### Principios de movimiento

- Curvas propias: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para entradas y presiones.
- Animaciones de UI por debajo de 300 ms; sheets y toasts son la excepción.
- Botones y tarjetas pulsables usan `scale(0.97–0.99)` en `:active`.
- Los hovers solo se aplican con `@media (hover: hover) and (pointer: fine)`.
- Nada aparece desde `scale(0)`: se combina opacidad con un desplazamiento o escala mínima.
- La navegación frecuente (sidebar) no anima colores; las listas entran escalonadas una sola vez.
- Con movimiento reducido se eliminan desplazamientos y se conservan fundidos.
- Confirmaciones destructivas con un toast de Sonner en lugar de `window.confirm`.
