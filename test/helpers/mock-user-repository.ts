import { type Mock, mock } from "bun:test";
import type { User } from "@/core/domain/entities/user";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";

export interface MockUserRepository extends UserRepositoryPort {
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
