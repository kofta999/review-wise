import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { ReviewBusinessDTO } from "@/common/dtos/review-business.dto";

export interface IReviewService {
  reviewBusiness(dto: ReviewBusinessDTO): Promise<number>;
  getReviewsForBusiness(businessId: number): Promise<GetBusinessReviewsDTO>;
}
