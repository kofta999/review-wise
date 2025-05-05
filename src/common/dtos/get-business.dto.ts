import { z } from "zod";

export const GetBusinessSchema = z.object({
	businessId: z.number(),
	name: z.string(),
	description: z.string(),
	averageRating: z.number(),
});

export type GetBusinessDTO = z.infer<typeof GetBusinessSchema>;
