import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatches from '../Interfaces/IMatches';

export default class MatchService {
  private model = MatchModel;
  private teamsModel = TeamModel;

  async getAll():Promise<IMatches[]> {
    const modelResponse = await this.model.findAll({
      include: [
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
    return modelResponse;
  }

  async getByProgress(progress: boolean) {
    const modelResponse = await this.model.findAll({
      where: { inProgress: progress },
      include: [
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
    return modelResponse;
  }

  async finishMatch(id: string):Promise<IMatches | null> {
    const [updateMatch] = await this.model.update(
      { inProgress: false },
      { where: { id } },
    );
    if (updateMatch === 0) return null;
    const endedMatch = await this.model.findByPk(id);
    return endedMatch;
  }

  async editMatch(
    id: string,
    homeTeamGoals: number,
    awayTeamGoals: number,
  )
    :Promise<IMatches | null> {
    const [updateMatch] = await this.model.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
    if (updateMatch === 0) return null;
    const endedMatch = await this.model.findByPk(id);
    return endedMatch;
  }

  async addMatch(
    homeTeamId: number,
    homeTeamGoals: number,
    awayTeamId: number,
    awayTeamGoals: number,
  )
    :Promise<IMatches | string> {
    const team1 = await this.teamsModel.findByPk(homeTeamId);
    const team2 = await this.teamsModel.findByPk(awayTeamId);
    if (!team1 || !team2) return ('Team not found');
    const { dataValues } = await this.model
      .create({ homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress: true });
    return dataValues;
  }
}
