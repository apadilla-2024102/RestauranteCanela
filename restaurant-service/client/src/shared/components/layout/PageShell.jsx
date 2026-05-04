import { ChefHat } from 'lucide-react';

export const PageShell = ({ title, subtitle, children }) => {
  return (
    <div className="page-shell">
      <header className="page-shell__hero">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat size={24} className="text-white" />
          </div>
          <div>
            <span className="eyebrow">Sistema de Gestión</span>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{title}</h1>
            {subtitle ? <p className="subtitle text-lg text-slate-600">{subtitle}</p> : null}
          </div>
        </div>
        <div className="hero-badge flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Minimalista • Profesional • Intuitivo
        </div>
      </header>

      <main className="page-shell__content">{children}</main>
    </div>
  );
};
