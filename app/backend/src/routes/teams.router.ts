import { Router, Request, Response } from 'express';
import TeamController from '../controllers/TeamController';

const teamController = new TeamController();

const teamsRouter = Router();

teamsRouter.get('/', (req: Request, res: Response) => teamController.getAll(req, res));
teamsRouter.get('/:id', (req: Request, res: Response) => teamController.getById(req, res));

export default teamsRouter;
