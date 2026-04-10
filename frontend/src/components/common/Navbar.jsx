import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
          <MenuIcon />
        </button>
        <div className="navbar-divider" />
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <span className="navbar-refresh-info">Refreshed: just now</span>

        <button className="nav-icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="nav-badge" />
        </button>

        <div className="navbar-user-sep" />

        <div className="navbar-user">
          <div className="navbar-user-avatar">{initials}</div>
          {user && (
            <div className="navbar-user-info">
              <div className="navbar-user-name">{`${user.firstName} ${user.lastName}`}</div>
              <div className="navbar-user-role">{user.role}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
