import { TYPES } from "@/common/types";
import { User } from "@/core/domain/entities/user";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import { sql } from "@pgtyped/runtime";
import { inject } from "inversify";
import type { PostgresDataSource } from "../data-sources/postgres/postgres.data-source";
import type {
	ICreateUserQuery,
	IGetUserByEmailQuery,
	IGetUserByIdQuery,
} from "../data-sources/postgres/types/user.repository.types";

export class UserRepositoryAdapter implements UserRepositoryPort {
	db: PostgresDataSource;

	constructor(@inject(TYPES.PostgresDataSource) db: PostgresDataSource) {
		this.db = db;
	}

	async create(user: User): Promise<number> {
		const createUser = sql<ICreateUserQuery>`insert into "user" ("email", "password", "role") values ($email, $password, $role) returning user_id`;

		const res = await createUser.run(
			{
				email: user.email,
				password: user.password,
				role: user.role,
			},
			this.db,
		);

		return res[0].user_id;
	}

	async getById(userId: number): Promise<User | null> {
		const getUserById = sql<IGetUserByIdQuery>`select * from "user" where "user_id" = $userId`;

		const res = await getUserById.run({ userId }, this.db);

		if (res.length === 0) {
			return null;
		}

		return new User({
			userId: res[0].user_id,
			email: res[0].email,
			password: res[0].password,
			createdAt: res[0].created_at,
			role: res[0].role,
		});
	}

	async getByEmail(email: string): Promise<User | null> {
		const getUserByEmail = sql<IGetUserByEmailQuery>`select * from "user" where "email" = $email`;

		const res = await getUserByEmail.run({ email }, this.db);

		if (res.length === 0) {
			return null;
		}

		return new User({
			userId: res[0].user_id,
			email: res[0].email,
			password: res[0].password,
			createdAt: res[0].created_at,
			role: res[0].role,
		});
	}
}
