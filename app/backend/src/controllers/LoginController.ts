import { Request, Response } from 'express';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(
    private loginService = new LoginService(),
  ) {}

  async doLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await this.loginService.doLogin(email, password);
    if (token === 'Invalid email or password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ token });
  }

  static sendRole(req: Request, res: Response) {
    const { user } = res.locals;
    const { role } = user;
    res.status(200).json({ role });
  }
}
