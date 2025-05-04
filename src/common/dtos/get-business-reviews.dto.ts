import { z } from "zod";
import { PaginatedSchema } from "../schemas/paginated-schema";

export const GetBusinessReviewsSchema = PaginatedSchema.extend({
	data: z.array(
		z.object({
			reviewId: z.number(),
			businessId: z.number(),
			rating: z.number(),
			title: z.string(),
			description: z.string(),
			createdAt: z.date(),
		}),
	),
});

export type GetBusinessReviewsDTO = z.infer<typeof GetBusinessReviewsSchema>;
