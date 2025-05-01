import type { userrole } from "@/data-access/types/user.repository.types";
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
  // Repositories
  IBusinessRepository: Symbol.for("IBusinessRepository"),
  IReviewRepository: Symbol.for("IReviewRepository"),
  IUserRepository: Symbol.for("IUserRepository"),
  // Services
  IBusinessService: Symbol.for("IBusinessService"),
  IReviewService: Symbol.for("IReviewService"),
  IUserService: Symbol.for("IUserService"),
  ICacheService: Symbol.for("ICacheService"),
  IJwtService: Symbol.for("IJwtService"),
  IPasswordService: Symbol.for("IPasswordService"),
  IDatabaseConnection: Symbol.for("IDatabaseConnection"),

  // Constants
  JWT_SECRET: Symbol.for("JWT_SECRET"),
};
