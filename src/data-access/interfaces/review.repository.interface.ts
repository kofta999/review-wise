import type { Rating } from "@/common/types";
import type { Review } from "@/domain/entities/review";

export interface IReviewRepository {
  create(review: Review): Promise<number>;
  remove(reviewId: number): Promise<void>;
  getReviewsForBusiness(businessId: number): Promise<Review[]>;
  getRatingsForBusiness(businessId: number): Promise<Rating[]>;
}
