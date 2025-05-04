import env from "@/env";
import type { IDatabaseConnection } from "@pgtyped/runtime";
import { injectable } from "inversify";
import pg from "pg";

export type IPostgresDataSource = IDatabaseConnection;

@injectable()
export class PostgresDataSource implements IDatabaseConnection {
	private readonly pool: pg.Pool;

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

		this.pool = new pg.Pool(config);
	}

	query(
		query: string,
		bindings: unknown[],
	): Promise<{ rows: unknown[]; rowCount: number }> {
		// @ts-ignore
		return this.pool.query(query, bindings);
	}
}
