import type { User } from "@/core/domain/entities/user";

export interface RegisterUserPort {
	registerUser(
		newUser: Pick<User, "email" | "password" | "role">,
	): Promise<number>;
}
