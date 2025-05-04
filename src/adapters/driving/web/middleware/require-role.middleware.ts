import { UnauthorizedError } from "@/common/errors/unauthorized";
import type { AppBindings, UserRole } from "@/common/types";
import { createMiddleware } from "hono/factory";

export const requireRole = (role: UserRole) =>
	createMiddleware<AppBindings>(async (c, next) => {
		const user = c.get("user");

		if (!user || user.role !== role) {
			throw new UnauthorizedError();
		}

		await next();
	});
