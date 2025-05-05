import type { User } from "@/core/domain/entities/user";

export interface UserRepositoryPort {
	create(user: User): Promise<number>;
	getById(userId: number): Promise<User | null>;
	getByEmail(email: string): Promise<User | null>;
}
