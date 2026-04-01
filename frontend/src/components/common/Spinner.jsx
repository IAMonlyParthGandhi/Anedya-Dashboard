import React from 'react';
import './Spinner.css';

export default function Spinner({ size = 'md' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-circle"></div>
    </div>
  );
}
