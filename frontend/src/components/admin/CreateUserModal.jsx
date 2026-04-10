import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Spinner from '../common/Spinner';
import './CreateUserModal.css';

const roleDescriptions = {
  'Admin':    'Full control over devices, users, and configuration.',
  'Operator': 'Can manage devices and view telemetry data.',
  'Viewer':   'Read-only access to dashboard and data.',
};

const EyeIcon = ({ closed }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
      </>
    )}
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function CreateUserModal({ roles, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: roles.length > 0 ? roles[0].id : ''
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const isPasswordValid = formData.password.length >= 8 && /\d/.test(formData.password);
  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true });
    if (!formData.firstName || !formData.lastName || !isEmailValid || !isPasswordValid) return;

    try {
      setLoading(true);
      setError('');
      await userService.createUser(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.id === parseInt(formData.roleId));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-top">
            <h2 className="modal-title">Provision New User</h2>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
          <p className="modal-subtitle">
            Create a new account with access roles within the IoT observatory.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} id="create-user-form">
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* Name Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  className={`form-input ${touched.firstName && !formData.firstName ? 'invalid' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  className={`form-input ${touched.lastName && !formData.lastName ? 'invalid' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Doe"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className={`form-input ${touched.email && !isEmailValid ? 'invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="j.doe@anedya.io"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Initial Password</label>
              <div className="form-input-wrap">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${touched.password && !isPasswordValid ? 'invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••••••"
                  disabled={loading}
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  className="form-input-icon"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  <EyeIcon closed={showPassword} />
                </button>
              </div>
              {formData.password.length > 0 && (
                <span className={`form-hint ${isPasswordValid ? 'hint-strong' : 'hint-weak'}`}>
                  {isPasswordValid ? '✓ Strong password' : 'Min 8 chars + 1 number required'}
                </span>
              )}
              <span className="form-hint" style={{ color: 'var(--clr-text-3)' }}>
                User will be prompted to change on first login.
              </span>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Access Role</label>
              <div className="role-cards">
                {roles.map(r => {
                  const isSelected = parseInt(formData.roleId) === r.id;
                  return (
                    <label
                      key={r.id}
                      className={`role-card-label ${isSelected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="roleId"
                        value={r.id}
                        checked={isSelected}
                        onChange={handleChange}
                      />
                      <span className="role-card-radio" />
                      <div className="role-card-text">
                        <div className="role-card-name">{r.name}</div>
                        <div className="role-card-desc">
                          {roleDescriptions[r.name] || 'Platform access role'}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading} id="confirm-user-btn">
              {loading ? <Spinner size="sm" /> : 'Confirm User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
