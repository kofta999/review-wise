import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { ReviewRepository } from "@/data-access/review.repository";
import type { Review } from "@/domain/entities/review";
import {
  type MockDatabaseConnection,
  createMockDatabaseConnection,
} from "test/helpers/mock-db-connection";

describe("Review repository", () => {
  let mockDb: MockDatabaseConnection;
  let repo: ReviewRepository;

  beforeEach(() => {
    mockDb = createMockDatabaseConnection();
    repo = new ReviewRepository(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("Should create a review and return reviewId", async () => {
      // Mock the database response
      mockDb.query.mockResolvedValueOnce({
        rows: [{ review_id: 5 }],
        rowCount: 1,
      });

      // Create a review object to pass to the repository
      const review: Review = {
        businessId: 1,
        rating: 4,
        title: "Good service",
        description: "I enjoyed my visit",
      };

      // Call the create method
      const reviewId = await repo.create(review);

      // Assert the reviewId was returned correctly
      expect(reviewId).toBe(5);

      // Verify the query was called correctly
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("insert into review"),
        expect.any(Object),
      );
    });

    it("Should throw error if review creation fails", async () => {
      // Mock database error
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      // Create a review object
      const review: Review = {
        businessId: 1,
        rating: 4,
        title: "Good service",
        description: "I enjoyed my visit",
      };

      // Assert that the method throws the expected error
      expect(repo.create(review)).rejects.toThrow("Database error");

      // Verify query was called
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("Should remove a review", async () => {
      // Mock successful removal
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
      });

      const reviewId = 5;

      // Call the remove method
      await repo.remove(reviewId);

      // Verify the query was called correctly
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("delete from review"),
        expect.any(Object),
      );
    });

    it("Should not throw error if review doesn't exist", async () => {
      // Mock no rows affected
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0, // No rows affected
      });

      const nonExistentReviewId = 999;

      // Call the remove method - should not throw
      await repo.remove(nonExistentReviewId);

      // Verify query was called
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if review removal fails", async () => {
      // Mock database error
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      const reviewId = 5;

      // Assert the method throws the expected error
      expect(repo.remove(reviewId)).rejects.toThrow("Database error");

      // Verify query was called
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });
});
