import { type Mock, mock } from "bun:test";
import type { IUserRepository } from "@/data-access/interfaces/user.repository.interface";
import type { User } from "@/domain/entities/user";

export interface MockUserRepository extends IUserRepository {
  create: Mock<(user: User) => Promise<number>>;
  getById: Mock<(userId: number) => Promise<User>>;
  getByEmail: Mock<(email: string) => Promise<User>>;
}

export function createMockUserRepository(): MockUserRepository {
  return {
    create: mock<(user: User) => Promise<number>>(),
    getById: mock<(userId: number) => Promise<User>>(),
    getByEmail: mock<(email: string) => Promise<User>>(),
  };
}
