import React from 'react';
import './Spinner.css';

export default function Spinner({ size = 'md' }) {
  return (
    <span className={`spinner spinner-${size}`} role="status" aria-label="Loading">
      <span className="spinner-ring" />
    </span>
  );
}
