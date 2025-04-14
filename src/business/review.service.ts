import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { ReviewBusinessDTO } from "@/common/dtos/review-business.dto";
import { Logger } from "@/common/util/logger";
import type { IReviewRepository } from "@/data-access/interfaces/review.repository.interface";
import { Review } from "@/domain/entities/review";
import type { IReviewService } from "./interfaces/review.service.interface";

export class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository;
  private logger = Logger.getLogger();

  constructor(reviewRepository: IReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async reviewBusiness(dto: ReviewBusinessDTO): Promise<number> {
    const review = new Review({ ...dto });

    const res = await this.reviewRepository.create(review);

    this.logger.info(`Created Review ${review.title} with ID ${res}`);

    return res;
  }

  async getReviewsForBusiness(
    businessId: number,
    { pagination }: { pagination: { limit: number; page: number } },
  ): Promise<GetBusinessReviewsDTO> {
    const reviews = await this.reviewRepository.getReviewsForBusiness(
      businessId,
      {
        limit: pagination.limit,
        offset: pagination.limit * (pagination.page - 1),
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
}
