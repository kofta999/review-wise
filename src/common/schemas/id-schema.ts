import { z } from "@hono/zod-openapi";

export const IdSchema = z.object({
	id: z.coerce.number().openapi({
		param: {
			name: "id",
			in: "path",
			required: true,
		},
		required: ["id"],
		default: 1,
	}),
});
