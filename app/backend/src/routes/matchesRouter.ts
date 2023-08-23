import { Router, Request, Response } from 'express';
import MatchController from '../controllers/MatchController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const matchController = new MatchController();

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) => matchController.getAll(req, res));

matchesRouter.patch(
  '/:id/finish',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

matchesRouter.patch(
  '/:id',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.editMatch(req, res),
);

matchesRouter.post(
  '/',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.addMatch(req, res),
);

export default matchesRouter;
