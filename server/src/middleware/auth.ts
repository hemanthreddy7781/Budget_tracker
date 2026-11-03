import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) { res.status(401).json({ error: 'Authentication required' }); return; }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    if (typeof payload.sub !== 'string' || !payload.email) throw new Error('Invalid token');
    req.user = { id: Number(payload.sub), email: String(payload.email) };
    if (!Number.isSafeInteger(req.user.id) || req.user.id < 1) throw new Error('Invalid user');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
