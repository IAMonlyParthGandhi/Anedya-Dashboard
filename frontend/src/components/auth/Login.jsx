import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import './Login.css';

const AnedyaLogo = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ closed }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
      </>
    )}
  </svg>
);

const AlertIcon = () => (
  <svg className="login-error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmailInvalid = emailTouched && (!email || !/\S+@\S+\.\S+/.test(email));
  const isPasswordInvalid = passwordTouched && !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!email || !password) return;

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      const returnTo = location.state?.returnTo || '/dashboard';
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-glow-bottom" />

      <div className="login-card">
        <div className="login-card-inner">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <AnedyaLogo />
            </div>
            <h1 className="login-title">
              Welcome to <span>Anedya</span>
            </h1>
            <p className="login-subtitle">Sign in to your IoT Observatory</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error" role="alert">
                <AlertIcon />
                {error}
              </div>
            )}

            <div className="login-form-group">
              <label className="login-label" htmlFor="login-email">Email Address</label>
              <div className="login-input-wrap">
                <input
                  id="login-email"
                  type="email"
                  className={`login-input ${isEmailInvalid ? 'invalid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="admin@anedya.io"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`login-input ${isPasswordInvalid ? 'invalid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="••••••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon closed={showPassword} />
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          {/* Footer hint */}
          <div className="login-footer">
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Default Credentials</span>
              <div className="login-divider-line" />
            </div>
            <p className="login-hint">
              Email: <code>admin@test.com</code>&nbsp;&nbsp;
              Password: <code>Admin123!</code>
            </p>
          </div>
        </div>

        <div className="login-version">Anedya IoT Platform • v2.4.1</div>
      </div>
    </div>
  );
}
