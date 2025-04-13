import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import type { IReviewService } from "@/business/interfaces/review.service.interface";
import { ReviewService } from "@/business/review.service";
import {
  type MockReviewRepository,
  createMockReviewRepository,
} from "test/helpers/mock-review-repository";

describe("Review service", () => {
  let mockReviewRepo: MockReviewRepository;
  let service: IReviewService;

  beforeEach(() => {
    mockReviewRepo = createMockReviewRepository();

    service = new ReviewService(mockReviewRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("reviewBusiness", () => {
    it("Should review business and return review id", async () => {
      const review = {
        businessId: 1,
        description: "test",
        rating: 2,
        title: "test",
      };

      mockReviewRepo.create.mockResolvedValueOnce(1);

      const reviewId = await service.reviewBusiness(review);

      expect(reviewId).toBe(1);
      expect(mockReviewRepo.create).toHaveBeenCalledTimes(1);
    });

    it("Should handle error cases from review repository", async () => {
      const review = {
        businessId: 1,
        description: "test",
        rating: 2,
        title: "test",
      };

      mockReviewRepo.create.mockRejectedValueOnce(new Error("database error"));

      expect(service.reviewBusiness(review)).rejects.toThrowError(
        "database error",
      );
      expect(mockReviewRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("getReviewsForBusiness", () => {
    it("Should get reviews for a business", async () => {
      const reviewsMock = [
        {
          businessId: 1,
          description: "test",
          rating: 2,
          title: "test",
        },
        {
          businessId: 1,
          description: "test",
          rating: 3,
          title: "test",
        },
      ];

      mockReviewRepo.getReviewsForBusiness.mockResolvedValueOnce(reviewsMock);

      const reviews = await service.getReviewsForBusiness(1);

      expect(reviews.length).toBe(reviewsMock.length);
      expect(reviews[0].description).toBe(reviewsMock[0].description);
      expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(1);
    });

    it("Should handle error cases from review repository", async () => {
      mockReviewRepo.getReviewsForBusiness.mockRejectedValueOnce(
        new Error("database error"),
      );

      expect(service.getReviewsForBusiness(1)).rejects.toThrowError(
        "database error",
      );
      expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(1);
    });
  });
});
