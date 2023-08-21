import { Request, Response, NextFunction } from 'express';

export default class LoginMiddleware {
  static verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) return res.status(400).json({ message: 'All fields must be filled' });
    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static verifyPassword(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'All fields must be filled' });
    if (password.length < 6) return res.status(401).json({ message: 'Invalid email or password' });
    next();
  }
}
