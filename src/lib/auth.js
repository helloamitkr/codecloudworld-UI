import crypto from 'crypto';

// Hash function for password verification
export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// Generate salt
export function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

// Verify password against hash
export function verifyPassword(password, hash, salt) {
  const hashedPassword = hashPassword(password, salt);
  return hashedPassword === hash;
}

// Create secure session token
export function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Environment-based auth configuration
export const authConfig = {
  // These will be hashed at build time, not stored as plain text
  username: process.env.ADMIN_USERNAME || 'admin',
  // Password hash and salt (generated at build time)
  passwordHash: process.env.ADMIN_PASSWORD_HASH,
  passwordSalt: process.env.ADMIN_PASSWORD_SALT,
  // Session configuration
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
};

// Client-side auth state management
export class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.sessionToken = null;
    this.attempts = 0;
    this.lockedUntil = null;
  }

  // Check if user is currently locked out
  isLockedOut() {
    if (this.lockedUntil && Date.now() < this.lockedUntil) {
      return true;
    }
    if (this.lockedUntil && Date.now() >= this.lockedUntil) {
      this.attempts = 0;
      this.lockedUntil = null;
    }
    return false;
  }

  // Increment failed attempts
  recordFailedAttempt() {
    this.attempts++;
    if (this.attempts >= authConfig.maxAttempts) {
      this.lockedUntil = Date.now() + authConfig.lockoutTime;
    }
  }

  // Reset attempts on successful login
  resetAttempts() {
    this.attempts = 0;
    this.lockedUntil = null;
  }

  // Check session validity
  isSessionValid() {
    if (!this.sessionToken || !this.sessionExpiry) return false;
    return Date.now() < this.sessionExpiry;
  }

  // Set authenticated state
  setAuthenticated(token) {
    this.isAuthenticated = true;
    this.sessionToken = token;
    this.sessionExpiry = Date.now() + authConfig.sessionTimeout;
    this.resetAttempts();
    
    // Store in sessionStorage (not localStorage for security)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_session', JSON.stringify({
        token: this.sessionToken,
        expiry: this.sessionExpiry
      }));
    }
  }

  // Clear authentication
  logout() {
    this.isAuthenticated = false;
    this.sessionToken = null;
    this.sessionExpiry = null;
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session');
    }
  }

  // Restore session from storage
  restoreSession() {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('admin_session');
      if (stored) {
        try {
          const { token, expiry } = JSON.parse(stored);
          if (Date.now() < expiry) {
            this.sessionToken = token;
            this.sessionExpiry = expiry;
            this.isAuthenticated = true;
            return true;
          } else {
            sessionStorage.removeItem('admin_session');
          }
        } catch (e) {
          sessionStorage.removeItem('admin_session');
        }
      }
    }
    return false;
  }
}

// Global auth manager instance
export const authManager = new AuthManager();
