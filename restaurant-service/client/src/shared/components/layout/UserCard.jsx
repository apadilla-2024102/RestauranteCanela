import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

const initialsOf = (value = '') =>
  value
    .split(/[@.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

export const UserCard = ({ user, onLogout }) => {
  const name = user?.name || user?.username || user?.email || 'Usuario';
  return (
    <div className="user-card">
      <span className="user-card__avatar" aria-hidden="true">
        {initialsOf(name)}
      </span>
      <div className="grow">
        <p className="user-card__name truncate">{name}</p>
        {user?.email && user.email !== name && <p className="user-card__email truncate">{user.email}</p>}
      </div>
      <Button variant="ghost" size="sm" icon onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
        <LogOut />
      </Button>
    </div>
  );
};
