import { Review } from "@/domain/entities/review";
import { z } from "zod";

export const GetBusinessReviewsSchema = z.array(z.instanceof(Review));

export type GetBusinessReviewsDTO = z.infer<typeof GetBusinessReviewsSchema>;
