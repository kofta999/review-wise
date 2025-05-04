import type { Rating } from "@/common/types";
import type { Review } from "@/core/domain/entities/review";

export interface ReviewRepositoryPort {
	create(review: Review): Promise<number>;
	remove(reviewId: number): Promise<void>;
	getReviewsForBusiness(
		businessId: number,
		pagination: { limit: number; offset: number },
		sorting: { asc: boolean; field: string },
	): Promise<Review<never>[]>;
	getRatingsForBusiness(businessId: number): Promise<Rating[]>;
	getReviewCount(businessId: number): Promise<number>;
}
