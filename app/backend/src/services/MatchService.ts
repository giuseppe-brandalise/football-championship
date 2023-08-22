import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import IMatches from '../Interfaces/IMatches';

export default class MatchService {
  private model = MatchModel;

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

  async getById(id: string):Promise<IMatches | null> {
    const modelResponse = await this.model.findByPk(id);
    return modelResponse;
  }
}
