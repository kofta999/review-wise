import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { ReviewBusinessDTO } from "@/common/dtos/review-business.dto";
import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import { TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import { Review } from "@/core/domain/entities/review";
import type { ReviewApiPort } from "@/ports/input/review";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";
import { inject, injectable } from "inversify";

@injectable()
export class ReviewService implements ReviewApiPort {
	private reviewRepository: ReviewRepositoryPort;
	private businessRepository: BusinessRepositoryPort;
	private logger = Logger.getLogger();

	constructor(
		@inject(TYPES.ReviewRepositoryPort) reviewRepository: ReviewRepositoryPort,
		@inject(TYPES.BusinessRepositoryPort)
		businessRepository: BusinessRepositoryPort,
	) {
		this.reviewRepository = reviewRepository;
		this.businessRepository = businessRepository;
	}

	async reviewBusiness(dto: ReviewBusinessDTO): Promise<number> {
		const review = new Review({ ...dto });
		const businessExists = this.businessRepository.exists(dto.businessId);

		if (!businessExists) {
			throw new BusinessNotFoundError(dto.businessId);
		}

		const res = await this.reviewRepository.create(review);

		this.logger.info(`Created Review ${review.title} with ID ${res}`);

		return res;
	}

	async getReviewsForBusiness(
		businessId: number,
		{
			pagination,
			sorting,
		}: {
			pagination: { limit: number; page: number };

			sorting: { asc: boolean; field: "rating" | "date" };
		},
	): Promise<GetBusinessReviewsDTO> {
		const businessExists = await this.businessRepository.exists(businessId);

		if (!businessExists) {
			throw new BusinessNotFoundError(businessId);
		}

		const reviews = await this.reviewRepository.getReviewsForBusiness(
			businessId,
			{
				limit: pagination.limit,
				offset: pagination.limit * (pagination.page - 1),
			},
			{
				asc: sorting.asc,
				field: sorting.field,
			},
		);

		this.logger.info(`Retrieved reviews for business with ID ${businessId}`);

		const count = await this.reviewRepository.getReviewCount(businessId);
		const totalPages = Math.ceil(count / pagination.limit);

		this.logger.info(`Retrieved review count for business with ID ${count}`);

		return {
			data: reviews,
			meta: {
				currentPage: pagination.page,
				totalPages,
				totalItems: count,
				hasNextPage: pagination.page < totalPages,
				hasPreviousPage: pagination.page > 1,
			},
		};
	}

	async removeReview(reviewId: number): Promise<void> {
		await this.reviewRepository.remove(reviewId);
		this.logger.info(`Admin has deleted review with ID ${reviewId}`);
	}
}
