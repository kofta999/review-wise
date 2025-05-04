import env from "@/env";
import type { IDatabaseConnection } from "@pgtyped/runtime";
import { injectable } from "inversify";
import pg from "pg";

@injectable()
export class PostgresDataSource extends pg.Pool implements IDatabaseConnection {
	constructor() {
		let config: pg.PoolConfig;

		if (env.DATABASE_URL) {
			config = {
				connectionString: env.DATABASE_URL,

				ssl: {
					rejectUnauthorized: false,
				},
			};
		} else {
			config = {
				port: env.PG_PORT,
				host: env.PG_HOST,
				user: env.PG_USER,
				password: env.PG_PASSWORD,
				database: env.PG_DB_NAME,
			};
		}

		super(config);
	}
}
