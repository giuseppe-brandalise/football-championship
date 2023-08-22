import { Router, Request, Response } from 'express';
import MatchController from '../controllers/MatchController';
// import AuthMiddleware from '../middlewares/AuthMiddleware';

const matchController = new MatchController();

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) => matchController.getAll(req, res));

// loginRouter.post(
//   '/',
//   LoginMiddleware.verifyEmail,
//   LoginMiddleware.verifyPassword,
//   (req: Request, res: Response) => loginController.doLogin(req, res),
// );

// loginRouter.get(
//   '/role',
//   AuthMiddleware.verifyToken,
//   (req: Request, res: Response) => LoginController.sendRole(req, res),
// );

export default matchesRouter;
