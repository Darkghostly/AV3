import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuarioId?: string;
}

export const authMiddleware = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const secret = process.env.JWT_SECRET || 'chave-super-secreta-aerocode-av3';
    const decoded = jwt.verify(token, secret) as { id: string };
    
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ erro: 'Token inválido ou expirado. Tentativa de intrusão bloqueada.' });
  }
};