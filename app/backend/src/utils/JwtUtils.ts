import * as jwt from 'jsonwebtoken';
import IPayload from '../Interfaces/IPayload';

export default class JwtUtils {
  private static jwtSecret = process.env.JWT_SECRET || '';

  static sign(payload: IPayload): string {
    return jwt.sign(payload, this.jwtSecret);
  }

  static verify(token: string): IPayload | string {
    try {
      return jwt.verify(token, this.jwtSecret) as IPayload;
    } catch (e) {
      return 'Token must be a valid token';
    }
  }
}
