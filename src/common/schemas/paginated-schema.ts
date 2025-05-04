import { z } from "zod";

/**
 * Should be extended with your result
 */
export const PaginatedSchema = z.object({
	meta: z.object({
		totalItems: z.number(),
		totalPages: z.number(),
		currentPage: z.number(),
		hasNextPage: z.boolean(),
		hasPreviousPage: z.boolean(),
	}),
});
