import React from 'react';
import './Toast.css';

const CheckIcon = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none">
    <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ICONS = {
  success: <CheckIcon />,
  error:   <AlertIcon />,
  info:    <InfoIcon />,
  warning: <WarningIcon />,
};

export default function Toast({ toasts, removeToast }) {
  if (!toasts?.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(({ id, message, type }) => (
        <div key={id} className={`toast ${type || 'info'}`} role="alert">
          {ICONS[type] || <InfoIcon />}
          <span className="toast-message">{message}</span>
          <button className="toast-close" onClick={() => removeToast(id)} aria-label="Dismiss">
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
