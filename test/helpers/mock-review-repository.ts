import { type Mock, mock } from "bun:test";
import type { Rating } from "@/common/types";
import type { IReviewRepository } from "@/data-access/interfaces/review.repository.interface";
import type { Review } from "@/domain/entities/review";

export interface MockReviewRepository extends IReviewRepository {
  create: Mock<(review: Review) => Promise<number>>;
  remove: Mock<(reviewId: number) => Promise<void>>;
  getReviewsForBusiness: Mock<(businessId: number) => Promise<Review[]>>;
  getRatingsForBusiness: Mock<(businessId: number) => Promise<Rating[]>>;
}

export function createMockReviewRepository(): MockReviewRepository {
  return {
    create: mock<(review: Review) => Promise<number>>(),
    remove: mock<(reviewId: number) => Promise<void>>(),
    getReviewsForBusiness: mock<(businessId: number) => Promise<Review[]>>(),
    getRatingsForBusiness: mock<(businessId: number) => Promise<Rating[]>>(),
  };
}
