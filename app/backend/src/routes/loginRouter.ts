import { Router, Request, Response } from 'express';
import LoginMiddleware from '../middlewares/LoginMiddleware';
import LoginController from '../controllers/LoginController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const loginController = new LoginController();

const loginRouter = Router();

loginRouter.post(
  '/',
  LoginMiddleware.verifyEmail,
  LoginMiddleware.verifyPassword,
  (req: Request, res: Response) => loginController.doLogin(req, res),
);

loginRouter.get(
  '/role',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => LoginController.sendRole(req, res),
);

export default loginRouter;
