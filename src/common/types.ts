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
