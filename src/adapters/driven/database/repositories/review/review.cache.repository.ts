import { type Rating, TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import { Review } from "@/core/domain/entities/review";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";
import { inject } from "inversify";
import { ReviewDatabaseRepository } from "./review.database.repository";

export class ReviewCacheRepository implements ReviewRepositoryPort {
	private readonly CACHE_KEY = "review";
	private readonly logger = Logger.getLogger();

	constructor(
		@inject(ReviewDatabaseRepository)
		private reviewRepository: ReviewDatabaseRepository,
		@inject(TYPES.CachePort) private cache: CachePort,
	) {}

	async create(review: Review): Promise<number> {
		// When creating reviews we need to invalidate cache for all reviews for that business
		const created = await this.reviewRepository.create(review);

		await this.cache.delByPattern(this.generateKey(review.businessId));

		return created;
	}

	remove(reviewId: number): Promise<void> {
		return this.reviewRepository.remove(reviewId);
	}

	async getReviewsForBusiness(
		businessId: number,
		pagination: { limit: number; offset: number },
		sorting: { asc: boolean; field: string },
	): Promise<Review<never>[]> {
		const key = this.generateKey(
			"business",
			businessId,
			"pagination",
			pagination.limit,
			pagination.offset,
			"sort",
			sorting.field,
			sorting.asc ? "asc" : "desc",
		);

		const cached = await this.cache.get<Review<never>[]>(key);

		if (cached) {
			this.logger.info(
				`Fetched reviews for business with ID ${businessId} from cache`,
			);
			return cached.map((rev) => new Review<never>({ ...rev }));
		}

		const reviews = await this.reviewRepository.getReviewsForBusiness(
			businessId,
			pagination,
			sorting,
		);

		this.cache.set(key, reviews);

		this.logger.info(
			`Added reviews for business with ID ${businessId} to cache`,
		);

		return reviews;
	}

	getRatingsForBusiness(businessId: number): Promise<Rating[]> {
		return this.reviewRepository.getRatingsForBusiness(businessId);
	}

	getReviewCount(businessId: number): Promise<number> {
		return this.reviewRepository.getReviewCount(businessId);
	}

	private generateKey(...args: (string | number)[]): string {
		return [this.CACHE_KEY, ...args].join(":");
	}
}
