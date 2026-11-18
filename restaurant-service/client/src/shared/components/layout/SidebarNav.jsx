import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS } from './navigation.js';

export const SidebarNav = ({ onNavigate }) => (
  <nav className="sidebar-nav" aria-label="Principal">
    {NAV_SECTIONS.map((section) => (
      <div key={section.label} className="sidebar-nav__section">
        <p className="sidebar-nav__label">{section.label}</p>
        <ul>
          {section.items.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink to={path} className="sidebar-nav__link" onClick={onNavigate}>
                <Icon size={16} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
);
