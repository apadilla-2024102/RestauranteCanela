import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Drawer } from 'vaul';
import { Menu } from 'lucide-react';
import { Brand } from './Brand.jsx';
import { SidebarNav } from './SidebarNav.jsx';
import { UserCard } from './UserCard.jsx';
import { NAV_SECTIONS } from './navigation.js';
import { Button } from '../ui/Button.jsx';

const currentLabel = (pathname) =>
  NAV_SECTIONS.flatMap((s) => s.items).find((item) => pathname.startsWith(item.path))?.label;

/** Barra superior en móvil/tablet con navegación en un drawer lateral. */
export const MobileTopbar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <Drawer.Root open={open} onOpenChange={setOpen} direction="left">
        <Drawer.Trigger asChild>
          <Button variant="ghost" size="sm" icon aria-label="Abrir navegación">
            <Menu />
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="sheet__overlay" />
          <Drawer.Content className="nav-drawer">
            <Drawer.Title className="visually-hidden">Navegación</Drawer.Title>
            <Drawer.Description className="visually-hidden">Módulos del sistema</Drawer.Description>
            <div className="sidebar__top">
              <Brand />
            </div>
            <div className="sidebar__scroll">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
            <div className="sidebar__bottom">
              <UserCard user={user} onLogout={onLogout} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <span className="topbar__title">{currentLabel(pathname) || 'Canela'}</span>
      <span className="brand__mark topbar__mark" aria-hidden="true">
        C
      </span>
    </header>
  );
};
