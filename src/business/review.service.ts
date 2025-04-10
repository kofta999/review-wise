import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { ReviewBusinessDTO } from "@/common/dtos/review-business.dto";
import { Logger } from "@/common/util/logger";
import type { ReviewRepository } from "@/data-access/review.repository";
import { Review } from "@/domain/entities/review";
import type { IReviewService } from "./interfaces/review.service.interface";

export class ReviewService implements IReviewService {
  private reviewRepository: ReviewRepository;
  private logger = Logger.getLogger();

  constructor(reviewRepository: ReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async reviewBusiness(dto: ReviewBusinessDTO): Promise<number> {
    const review = new Review({ ...dto });

    const res = await this.reviewRepository.create(review);

    this.logger.info(
      `Created Review ${review.title} with ID ${review.reviewId}`,
    );

    return res;
  }

  async getReviewsForBusiness(
    businessId: number,
  ): Promise<GetBusinessReviewsDTO> {
    const reviews =
      await this.reviewRepository.getReviewsForBusiness(businessId);

    this.logger.info(`Retrieved reviews for business with ID ${businessId}`);

    return reviews;
  }
}
