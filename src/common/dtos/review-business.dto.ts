import { z } from "zod";

export const ReviewBusinessSchema = z.object({
  businessId: z.number(),
  title: z.string(),
  description: z.string(),
  rating: z.number().min(1).max(5),
});

export type ReviewBusinessDTO = z.infer<typeof ReviewBusinessSchema>;
