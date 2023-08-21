import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) {}

  async getAll(_req: Request, res: Response) {
    const serviceResponse = await this.teamService.getAll();
    res.status(200).json(serviceResponse);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.teamService.getById(id);
    res.status(200).json(serviceResponse);
  }
}
