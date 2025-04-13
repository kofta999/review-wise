import { User } from "@/domain/entities/user";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type { IUserRepository } from "./interfaces/user.repository.interface";
import type {
  ICreateUserQuery,
  IGetUserQuery,
} from "./types/user.repository.types";

export class UserRepository implements IUserRepository {
  db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
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

  async getById(userId: number): Promise<User> {
    const getUser = sql<IGetUserQuery>`select * from "user" where "user_id" = $userId`;

    const res = await getUser.run({ userId }, this.db);

    return new User({
      userId: res[0].user_id,
      email: res[0].email,
      password: res[0].password,
      createdAt: res[0].created_at,
      role: res[0].role,
    });
  }
}
