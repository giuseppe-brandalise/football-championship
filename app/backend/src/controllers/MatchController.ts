import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress) {
      const progress = inProgress === 'true';
      const serviceResponse = await this.matchService.getByProgress(progress);
      return res.status(200).json(serviceResponse);
    }
    const serviceResponse = await this.matchService.getAll();
    return res.status(200).json(serviceResponse);
  }

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(id);
    if (!serviceResponse) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(200).json({ message: 'Finished' });
  }

  async editMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const serviceResponse = await this.matchService
      .editMatch(id, Number(homeTeamGoals), Number(awayTeamGoals));
    if (!serviceResponse) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(200).json({ message: 'Finished' });
  }

  async addMatch(req: Request, res: Response) {
    const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const serviceResponse = await this.matchService
      .addMatch(
        Number(homeTeamId),
        Number(homeTeamGoals),
        Number(awayTeamId),
        Number(awayTeamGoals),
      );
    if (serviceResponse === 'Team not found') {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }
    return res.status(201).json(serviceResponse);
  }
}
