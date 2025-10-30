import { useState, useEffect } from 'react';
import { authManager } from '../lib/auth';
import styles from '../styles/AdminAuth.module.css';

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const hasSession = authManager.restoreSession();
    if (hasSession) {
      // Verify session with server
      verifySession();
    } else {
      setLoading(false);
      setShowLogin(true);
    }
  }, []);

  const verifySession = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authManager.sessionToken })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        authManager.logout();
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      authManager.logout();
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token) => {
    authManager.setAuthenticated(token);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    authManager.logout();
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {showLogin && (
          <LoginModal 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
          />
        )}
        <div className={styles.unauthorized}>
          <h2>🔒 Admin Access Required</h2>
          <p>Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => setShowLogin(true)}
            className={styles.loginButton}
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={styles.authenticatedWrapper}>
      <div className={styles.authHeader}>
        <span className={styles.authStatus}>
          🔓 Authenticated as: <strong>{authManager.sessionToken ? 'Admin' : 'User'}</strong>
        </span>
        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}

function LoginModal({ onLoginSuccess, onClose }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  useEffect(() => {
    // Check if user is locked out
    if (authManager.isLockedOut()) {
      setError('Too many failed attempts. Please try again later.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authManager.isLockedOut()) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.token);
        setCredentials({ username: '', password: '' });
      } else {
        authManager.recordFailedAttempt();
        setAttempts(prev => prev + 1);
        
        if (data.lockedUntil) {
          setLockoutTime(data.lockedUntil);
        }
        
        setError(data.message || 'Login failed');
        
        // Clear password field on failed attempt
        setCredentials(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>🔐 Admin Login</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !credentials.username || !credentials.password}
            className={styles.submitButton}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className={styles.securityInfo}>
          <small>
            🔒 Secure authentication with rate limiting and session management
          </small>
        </div>
      </div>
    </div>
  );
}
