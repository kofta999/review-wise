import type { AppBindings } from "@/common/types";
import { OpenAPIHono } from "@hono/zod-openapi";

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook: (result, c) => {
			if (result.success === false) {
				const errors = result.error.issues.map(({ message, path }) => ({
					message,
					path: path[0],
				}));

				return c.json({ errors }, 422);
			}
		},
	});
}
