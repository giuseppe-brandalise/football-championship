import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  async getLeaderBoardHome(_req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.leaderboardService.leaderboard('home');
    return res.status(200).json(serviceResponse);
  }

  async getLeaderBoardAway(_req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.leaderboardService.leaderboard('away');
    return res.status(200).json(serviceResponse);
  }

  async getLeaderBoard(_req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.leaderboardService.leaderboard('general');
    return res.status(200).json(serviceResponse);
  }
}
