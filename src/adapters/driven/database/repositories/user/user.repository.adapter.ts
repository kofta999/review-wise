import type { User } from "@/core/domain/entities/user";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import { inject, injectable } from "inversify";
import { UserDatabaseRepository } from "./user.database.repository";

@injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
	constructor(
		@inject(UserDatabaseRepository)
		private repository: UserDatabaseRepository,
	) {}

	create(user: User): Promise<number> {
		return this.repository.create(user);
	}

	getById(userId: number): Promise<User | null> {
		return this.repository.getById(userId);
	}

	getByEmail(email: string): Promise<User | null> {
		return this.repository.getByEmail(email);
	}
}
