import type { Rating } from "@/common/types";
import type { Review } from "@/core/domain/entities/review";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";
import { inject, injectable } from "inversify";
import { ReviewCacheRepository } from "./review.cache.repository";

@injectable()
export class ReviewRepositoryAdapter implements ReviewRepositoryPort {
	constructor(
		@inject(ReviewCacheRepository)
		private repository: ReviewCacheRepository,
	) {}

	create(review: Review): Promise<number> {
		return this.repository.create(review);
	}

	remove(reviewId: number): Promise<void> {
		return this.repository.remove(reviewId);
	}

	getReviewsForBusiness(
		businessId: number,
		pagination: { limit: number; offset: number },
		sorting: { asc: boolean; field: string },
	): Promise<Review<never>[]> {
		return this.repository.getReviewsForBusiness(
			businessId,
			pagination,
			sorting,
		);
	}

	getRatingsForBusiness(businessId: number): Promise<Rating[]> {
		return this.repository.getRatingsForBusiness(businessId);
	}

	getReviewCount(businessId: number): Promise<number> {
		return this.repository.getReviewCount(businessId);
	}
}
