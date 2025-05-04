import { HonoJwtAdapter } from "@/adapters/driven/security/hono-jwt.adapter";
import { UnauthorizedError } from "@/common/errors/unauthorized";
import type { AppBindings, UserRole } from "@/common/types";
import env from "@/env";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	// TODO: Decouple
	const jwtService = new HonoJwtAdapter<{
		email: string;
		id: string;
		role: UserRole;
	}>(env.JWT_SECRET);
	const header = c.req.header("Authorization");

	if (!header) {
		throw new UnauthorizedError();
	}

	const tokenString = header.substring(7);

	try {
		const payload = await jwtService.verify(tokenString);
		c.set("user", payload);
		await next();
	} catch (error) {
		throw new UnauthorizedError();
	}
});
