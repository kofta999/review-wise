import bcrypt from "bcryptjs";
import type { IPasswordService } from "./interfaces/password.service.interface";

export class BcryptPasswordService implements IPasswordService {
  private SALT_ROUNDS = 10 as const;

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
