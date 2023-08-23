import { Router, Request, Response } from 'express';
import LeaerboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaerboardController();

const leaderboardRouter = Router();

leaderboardRouter.get(
  '/',
  (req: Request, res: Response) => leaderboardController.getLeaderBoard(req, res),
);

leaderboardRouter.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getLeaderBoardHome(req, res),
);

leaderboardRouter.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.getLeaderBoardAway(req, res),
);

export default leaderboardRouter;
