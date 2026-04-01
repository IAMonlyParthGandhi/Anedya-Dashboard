import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem', color: 'var(--color-danger)' }}>403</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem' }}>Access Denied</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        You do not have the required permissions to view this page.
      </p>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--color-surface-2)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '1rem'
        }}
      >
        Go Back
      </button>
    </div>
  );
}
