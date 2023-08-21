import * as bcrypt from 'bcryptjs';
import JwtUtils from '../utils/JwtUtils';
import UserModel from '../database/models/UserModel';

export default class LoginService {
  private model = UserModel;

  async doLogin(email: string, password: string):Promise<string> {
    const modelResponse = await this.model.findOne({ where: { email } });
    if (!modelResponse) return 'Invalid email or password';
    if (!bcrypt.compareSync(password, modelResponse.password)) {
      return 'Invalid email or password';
    }
    const { id, role } = modelResponse;
    const token = JwtUtils.sign({ id, role });
    return token;
  }
}
