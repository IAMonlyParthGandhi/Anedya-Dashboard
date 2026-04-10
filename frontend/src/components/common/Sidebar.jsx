import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import './Sidebar.css';

const AnedyaLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DashboardIcon = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
  </svg>
);

const UsersIcon = () => (
  <svg className="nav-link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M18 21C18 18.2386 15.3137 16 12 16C8.68629 16 6 18.2386 6 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.75"/>
    <path d="M20 21C20 18.2386 17.3137 16 14 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const roleName = user.role || 'User';

  let roleBadgeClass = 'badge-viewer';
  if (roleName === 'Admin') roleBadgeClass = 'badge-admin';
  if (roleName === 'Operator') roleBadgeClass = 'badge-operator';

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>

        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo-icon-wrap">
            <AnedyaLogo />
          </div>
          <div className="logo-text-block">
            <div className="logo-title">Anedya IoT</div>
            <div className="logo-sub">The Digital Observatory</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <DashboardIcon />
            Dashboard
          </NavLink>

          {hasPermission(user, PERMISSIONS.MANAGE_USERS) && (
            <>
              <div className="nav-section-label">Administration</div>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <UsersIcon />
                User Management
              </NavLink>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info-block">
              <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
              <div className={`role-chip ${roleBadgeClass}`}>{roleName}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
