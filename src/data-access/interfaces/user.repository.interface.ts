import type { User } from "@/domain/entities/user";

export interface IUserRepository {
  create(user: User): Promise<number>;
  getById(userId: number): Promise<User>;
  getByEmail(email: string): Promise<User>;
}
