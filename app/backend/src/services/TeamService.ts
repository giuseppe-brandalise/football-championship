import TeamModel from '../database/models/TeamModel';
import ITeams from '../Interfaces/ITeams';

export default class TeamService {
  private model = TeamModel;

  async getAll():Promise<ITeams[]> {
    const modelResponse = await this.model.findAll();
    return modelResponse;
  }

  async getById(id: string):Promise<ITeams | null> {
    const modelResponse = await this.model.findByPk(id);
    return modelResponse;
  }
}
