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
      return res.status(404).json({ message: 'Match no found' });
    }
    res.status(200).json({ message: 'Finished' });
  }
}
