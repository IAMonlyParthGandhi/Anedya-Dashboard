import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Spinner from '../common/Spinner';
import './CreateUserModal.css';

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.firstName && !formData.firstName ? 'input-error' : ''}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.lastName && !formData.lastName ? 'input-error' : ''}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && !isEmailValid ? 'input-error' : ''}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && !isPasswordValid ? 'input-error' : ''}
              disabled={loading}
            />
            <div className="password-hint">
              {formData.password.length > 0 && (
                <span className={isPasswordValid ? 'hint-strong' : 'hint-weak'}>
                  {isPasswordValid ? 'Strong password' : 'Weak: requires 8+ chars and 1 number'}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              disabled={loading}
            >
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
