import { verifySession } from './login';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const session = await verifySession(token);
    
    if (session) {
      res.status(200).json({
        success: true,
        session: {
          username: session.username,
          expiresAt: session.expiresAt
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
