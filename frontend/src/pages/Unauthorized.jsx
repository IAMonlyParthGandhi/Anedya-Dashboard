import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-code">403</h1>
      <h2 className="unauthorized-heading">Access Denied</h2>
      <p className="unauthorized-message">
        You do not have the required permissions to view this page.
      </p>
      <button className="unauthorized-back" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}
