import { Router, Request, Response } from 'express';
import MatchController from '../controllers/MatchController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const matchController = new MatchController();

const matchesRouter = Router();

matchesRouter.get('/', (req: Request, res: Response) => matchController.getAll(req, res));

matchesRouter.patch(
  '/:id/finished',
  AuthMiddleware.verifyToken,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

export default matchesRouter;
