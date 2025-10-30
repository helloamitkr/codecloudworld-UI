import { verifyPassword, createSessionToken, authConfig } from '../../../lib/auth';

// Rate limiting storage (in production, use Redis or database)
const attempts = new Map();
const sessions = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

  // Rate limiting check
  const attemptKey = `${clientIP}:${username}`;
  const userAttempts = attempts.get(attemptKey) || { count: 0, lockedUntil: null };

  // Check if user is locked out
  if (userAttempts.lockedUntil && Date.now() < userAttempts.lockedUntil) {
    const remainingTime = Math.ceil((userAttempts.lockedUntil - Date.now()) / 1000 / 60);
    return res.status(429).json({ 
      message: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
      lockedUntil: userAttempts.lockedUntil
    });
  }

  // Reset attempts if lockout period has passed
  if (userAttempts.lockedUntil && Date.now() >= userAttempts.lockedUntil) {
    attempts.delete(attemptKey);
    userAttempts.count = 0;
    userAttempts.lockedUntil = null;
  }

  try {
    // Verify credentials
    const isValidUsername = username === authConfig.username;
    
    // For development, allow plain text password comparison
    // In production, this will use hashed passwords
    let isValidPassword = false;
    
    if (process.env.NODE_ENV === 'development') {
      // Development: compare plain text (from .env.local)
      isValidPassword = password === process.env.ADMIN_PASSWORD;
    } else {
      // Production: compare hashed password
      if (authConfig.passwordHash && authConfig.passwordSalt) {
        isValidPassword = verifyPassword(password, authConfig.passwordHash, authConfig.passwordSalt);
      }
    }

    if (isValidUsername && isValidPassword) {
      // Successful login
      attempts.delete(attemptKey);
      
      // Create session
      const sessionToken = createSessionToken();
      const sessionExpiry = Date.now() + authConfig.sessionTimeout;
      
      sessions.set(sessionToken, {
        username,
        createdAt: Date.now(),
        expiresAt: sessionExpiry,
        ip: clientIP
      });

      // Clean up expired sessions
      for (const [token, session] of sessions.entries()) {
        if (Date.now() > session.expiresAt) {
          sessions.delete(token);
        }
      }

      res.status(200).json({
        success: true,
        token: sessionToken,
        expiresAt: sessionExpiry,
        message: 'Login successful'
      });
    } else {
      // Failed login
      userAttempts.count++;
      
      if (userAttempts.count >= authConfig.maxAttempts) {
        userAttempts.lockedUntil = Date.now() + authConfig.lockoutTime;
      }
      
      attempts.set(attemptKey, userAttempts);

      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsRemaining: Math.max(0, authConfig.maxAttempts - userAttempts.count)
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Verify session endpoint
export async function verifySession(token) {
  const session = sessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) sessions.delete(token);
    return null;
  }
  return session;
}
