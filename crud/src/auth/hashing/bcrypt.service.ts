import { HashingServiceProtocol } from "./hashing.service";
import * as bcrypt from 'bcrypt';

export class BcryptService extends HashingServiceProtocol {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt); // generates the hash
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash); //true === loggedIn
  }
}