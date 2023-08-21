import { Request, Response, NextFunction } from 'express';
import JwtUtils from '../utils/JwtUtils';

export default class AuthMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) return res.status(400).json({ message: 'Token not found' });
    const splitedToken = token.split(' ');
    const validedToken = JwtUtils.verify(splitedToken[splitedToken.length - 1]);
    if (validedToken === 'Token must be a valid token') {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    res.locals.user = validedToken;
    next();
  }
}
