import { createMiddleware } from "hono/factory";
import { UnauthorizedError } from "../errors/unauthorized";
import type { AppBindings, UserRole } from "../types";

export const requireRole = (role: UserRole) =>
  createMiddleware<AppBindings>(async (c, next) => {
    const user = c.get("user");

    if (!user || user.role !== role) {
      throw new UnauthorizedError();
    }

    await next();
  });
