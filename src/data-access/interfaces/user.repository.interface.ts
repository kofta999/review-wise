import type { User } from "@/domain/entities/user";

export interface IUserRepository {
  create(user: User): Promise<number>;
  getById(userId: number): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
}
