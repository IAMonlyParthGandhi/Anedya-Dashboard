import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Unauthorized.css';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-root">
      <div className="unauthorized-blob" />

      <div className="unauthorized-card">
        <div className="unauthorized-icon-wrap">
          <ShieldIcon />
        </div>
        <div className="unauthorized-code">403</div>
        <h1 className="unauthorized-heading">Access Denied</h1>
        <p className="unauthorized-message">
          You don't have the required permissions to view this page.
          Contact your administrator to request access.
        </p>
        <div className="unauthorized-actions">
          <button className="unauthorized-back" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <Link to="/dashboard" className="unauthorized-home">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
