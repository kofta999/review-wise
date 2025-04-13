import * as Bun from "bun";
import type { IPasswordService } from "./interfaces/password.service.interface";

export class BunPasswordService implements IPasswordService {
  hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password);
  }
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return Bun.password.verify(plainPassword, hashedPassword);
  }
}
