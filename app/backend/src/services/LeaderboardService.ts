import MatchService from './MatchService';
import IMatches from '../Interfaces/IMatches';
import { calculateHomePoints, calculateAwayPoints,
  calculateTotalPoints } from '../utils/PontuationUtils';
import ITeamPontuation from '../Interfaces/ITeamPontuation';

export default class LeaderboardService {
  constructor(private matchService = new MatchService()) {}

  async getFinishedGames(): Promise <IMatches[]> {
    const modelResponse = await this.matchService.getByProgress(false);
    return modelResponse;
  }

  async leaderboard(homeVisitor: string): Promise<ITeamPontuation[]> {
    const finishedGames = await this.getFinishedGames();
    if (homeVisitor === 'home') {
      const response = calculateHomePoints(finishedGames);
      return response;
    }
    if (homeVisitor === 'away') {
      const response = calculateAwayPoints(finishedGames);
      return response;
    }
    const response = calculateTotalPoints(finishedGames);
    return response;
  }
}
