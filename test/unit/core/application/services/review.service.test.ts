import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { ReviewService } from "@/core/application/services/review.service";
import type { ReviewApiPort } from "@/ports/input/review";
import {
	type MockBusinessRepository,
	createMockBusinessRepository,
} from "test/helpers/mock-business-repository";
import {
	type MockReviewRepository,
	createMockReviewRepository,
} from "test/helpers/mock-review-repository";

describe("Review service", () => {
	let mockReviewRepo: MockReviewRepository;
	let mockBusinessRepo: MockBusinessRepository;
	let service: ReviewApiPort;

	beforeEach(() => {
		mockReviewRepo = createMockReviewRepository();
		mockBusinessRepo = createMockBusinessRepository();
		service = new ReviewService(mockReviewRepo, mockBusinessRepo);
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

			mockBusinessRepo.exists.mockResolvedValueOnce(true);
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

			mockBusinessRepo.exists.mockResolvedValueOnce(true);
			mockReviewRepo.create.mockRejectedValueOnce(new Error("database error"));

			expect(service.reviewBusiness(review)).rejects.toThrowError(
				"database error",
			);
			expect(mockReviewRepo.create).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if the business does not exist", async () => {
			const review = {
				businessId: 1,
				description: "test",
				rating: 2,
				title: "test",
			};

			mockBusinessRepo.exists.mockResolvedValueOnce(false);
			mockReviewRepo.create.mockRejectedValueOnce(new Error("database error"));

			expect(service.reviewBusiness(review)).rejects.toThrowError(
				"database error",
			);
			expect(mockReviewRepo.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("getReviewsForBusiness", () => {
		it("Should get reviews for a business with pagination data", async () => {
			const reviewsMock = [
				{
					reviewId: 1,
					businessId: 1,
					description: "test",
					rating: 3,
					title: "test",
					createdAt: new Date(),
				},
				{
					reviewId: 2,
					businessId: 1,
					description: "test",
					rating: 2,
					title: "test",
					createdAt: new Date(),
				},
			];

			const params = {
				pagination: {
					limit: 10,
					page: 1,
				},
				sorting: {
					asc: true,
					field: "rating" as const,
				},
			};

			const reviewCount = 15;

			mockBusinessRepo.exists.mockResolvedValueOnce(true);
			mockReviewRepo.getReviewsForBusiness.mockResolvedValueOnce(reviewsMock);
			mockReviewRepo.getReviewCount.mockResolvedValueOnce(reviewCount);

			const result = await service.getReviewsForBusiness(1, params);

			// Check the returned data structure
			expect(result).toHaveProperty("data");
			expect(result).toHaveProperty("meta");

			// Check the data content
			expect(result.data).toEqual(reviewsMock);
			expect(result.data.length).toBe(reviewsMock.length);

			// Check the meta content
			expect(result.meta).toEqual({
				currentPage: 1,
				totalPages: 2, // 15/10 = 1.5, rounded up to 2
				totalItems: reviewCount,
				hasNextPage: true, // page 1 < totalPages 2
				hasPreviousPage: false, // page 1 > 1
			});

			// Verify repository calls
			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(1);
			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledWith(
				1,
				{
					limit: params.pagination.limit,
					offset: params.pagination.limit * (params.pagination.page - 1),
				},
				{ asc: params.sorting.asc, field: params.sorting.field },
			);
			expect(mockReviewRepo.getReviewCount).toHaveBeenCalledTimes(1);
			expect(mockReviewRepo.getReviewCount).toHaveBeenCalledWith(1);
		});

		it("Should handle pagination correctly for different pages", async () => {
			const reviewsMock = [
				{
					reviewId: 1,
					businessId: 1,
					description: "test",
					rating: 3,
					title: "test",
					createdAt: new Date(),
				},
			];

			const params = {
				pagination: {
					limit: 5,
					page: 2,
				},
				sorting: {
					asc: true,
					field: "rating" as const,
				},
			};

			const reviewCount = 9;

			mockBusinessRepo.exists.mockResolvedValueOnce(true);
			mockReviewRepo.getReviewsForBusiness.mockResolvedValueOnce(reviewsMock);
			mockReviewRepo.getReviewCount.mockResolvedValueOnce(reviewCount);

			const result = await service.getReviewsForBusiness(1, params);

			// Verify the meta content for page 2
			expect(result.meta).toEqual({
				currentPage: 2,
				totalPages: 2, // 9/5 = 1.8, rounded up to 2
				totalItems: reviewCount,
				hasNextPage: false, // page 2 > totalPages 2
				hasPreviousPage: true, // page 2 > 1
			});

			// Verify correct offset calculation
			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledWith(
				1,
				{
					limit: 5,
					offset: 5, // limit * (page - 1) = 5 * (2 - 1) = 5
				},
				{ asc: params.sorting.asc, field: params.sorting.field },
			);
		});

		it("Should handle error cases from review repository", async () => {
			mockBusinessRepo.exists.mockResolvedValueOnce(true);
			mockReviewRepo.getReviewsForBusiness.mockRejectedValueOnce(
				new Error("database error"),
			);

			expect(
				service.getReviewsForBusiness(1, {
					pagination: { limit: 10, page: 1 },
					sorting: { asc: true, field: "rating" },
				}),
			).rejects.toThrowError("database error");
			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(1);
		});

		it("Should handle error cases from getReviewCount", async () => {
			const reviewsMock = [
				{
					reviewId: 1,
					businessId: 1,
					description: "test",
					rating: 2,
					title: "test",
					createdAt: new Date(),
				},
			];

			mockBusinessRepo.exists.mockResolvedValueOnce(true);
			mockReviewRepo.getReviewsForBusiness.mockResolvedValueOnce(reviewsMock);
			mockReviewRepo.getReviewCount.mockRejectedValueOnce(
				new Error("count error"),
			);

			expect(
				service.getReviewsForBusiness(1, {
					pagination: { limit: 10, page: 1 },
					sorting: { asc: true, field: "rating" },
				}),
			).rejects.toThrowError("count error");

			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(1);
			expect(mockReviewRepo.getReviewCount).toHaveBeenCalledTimes(1);
		});

		it("Should handle error cases from exists", async () => {
			mockBusinessRepo.exists.mockRejectedValueOnce(
				new Error("database error"),
			);

			expect(
				service.getReviewsForBusiness(1, {
					pagination: { limit: 10, page: 1 },
					sorting: { asc: true, field: "rating" },
				}),
			).rejects.toThrowError("database error");

			expect(mockBusinessRepo.exists).toHaveBeenCalledTimes(1);
			expect(mockReviewRepo.getReviewsForBusiness).toHaveBeenCalledTimes(0);
			expect(mockReviewRepo.getReviewCount).toHaveBeenCalledTimes(0);
		});
	});

	describe("adminRemoveReview", () => {
		it("Should remove a review for a reviewId", async () => {
			mockReviewRepo.remove.mockResolvedValueOnce();

			expect(service.removeReview(1)).resolves;
			expect(mockReviewRepo.remove).toHaveBeenCalledTimes(1);
		});

		it("Should handle error cases from review repository", async () => {
			mockReviewRepo.remove.mockRejectedValueOnce(new Error("database error"));

			expect(service.removeReview(1)).rejects.toThrow("database error");
			expect(mockReviewRepo.remove).toHaveBeenCalledTimes(1);
		});
	});
});
