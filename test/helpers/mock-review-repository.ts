import { type Mock, mock } from "bun:test";
import type { Rating } from "@/common/types";
import type { Review } from "@/core/domain/entities/review";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";

export interface MockReviewRepository extends ReviewRepositoryPort {
	create: Mock<(review: Review) => Promise<number>>;
	remove: Mock<(reviewId: number) => Promise<void>>;
	getReviewsForBusiness: Mock<(businessId: number) => Promise<Review<never>[]>>;
	getRatingsForBusiness: Mock<(businessId: number) => Promise<Rating[]>>;
	getReviewCount: Mock<(businessId: number) => Promise<number>>;
}

export function createMockReviewRepository(): MockReviewRepository {
	return {
		create: mock<(review: Review) => Promise<number>>(),
		remove: mock<(reviewId: number) => Promise<void>>(),
		getReviewsForBusiness:
			mock<(businessId: number) => Promise<Review<never>[]>>(),
		getRatingsForBusiness: mock<(businessId: number) => Promise<Rating[]>>(),
		getReviewCount: mock<(businessId: number) => Promise<number>>(),
	};
}
