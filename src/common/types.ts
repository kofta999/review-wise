import type { userrole } from "@/adapters/driven/database/data-sources/postgres/types/user.repository.types";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Env } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings extends Env {
	Variables: {
		logger: PinoLogger;
		user: { id: string; email: string; role: UserRole };
	};
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;

export type Rating = number;

export type UserRole = userrole;

export const TYPES = {
	// Input Ports
	BusinessApiPort: Symbol.for("BusinessApiPort"),
	ReviewApiPort: Symbol.for("ReviewApiPort"),
	UserApiPort: Symbol.for("UserApiPort"),

	// Output Ports
	BusinessRepositoryPort: Symbol.for("BusinessRepositoryPort"),
	ReviewRepositoryPort: Symbol.for("ReviewRepositoryPort"),
	UserRepositoryPort: Symbol.for("UserRepositoryPort"),
	CachePort: Symbol.for("CachePort"),
	JwtPort: Symbol.for("JwtPort"),
	PasswordPort: Symbol.for("PasswordPort"),

	// Data Sources
	PostgresDataSource: Symbol.for("PostgresDataSource"),

	// Constants
	JWT_SECRET: Symbol.for("JWT_SECRET"),
};
