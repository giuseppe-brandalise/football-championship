import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  async getAll(_req: Request, res: Response) {
    const serviceResponse = await this.matchService.getAll();
    res.status(200).json(serviceResponse);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.getById(id);
    res.status(200).json(serviceResponse);
  }
}
