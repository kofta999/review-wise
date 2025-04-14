import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  spyOn,
} from "bun:test";
import { ReviewRepository } from "@/data-access/review.repository";
import { Review } from "@/domain/entities/review";
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
    // biome-ignore lint/suspicious/noExplicitAny: Private property
    spyOn(repo as any, "exists").mockResolvedValue(true);
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
      const review = new Review({
        businessId: 1,
        rating: 4,
        title: "Good service",
        description: "I enjoyed my visit",
      });

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
      const review = new Review({
        businessId: 1,
        rating: 4,
        title: "Good service",
        description: "I enjoyed my visit",
      });

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

  describe("getReviewsForBusiness", () => {
    it("Should return reviews for a business", async () => {
      const mockReviews = [
        {
          reviewId: 1,
          businessId: 1,
          title: "Great place",
          rating: 5,
          description: "Excellent service",
          createdAt: new Date().toISOString(),
        },
        {
          reviewId: 2,
          businessId: 1,
          title: "Good experience",
          rating: 4,
          description: "Would visit again",
          createdAt: new Date().toISOString(),
        },
      ];

      mockDb.query.mockResolvedValueOnce({
        rows: mockReviews,
        rowCount: 2,
      });

      const reviews = await repo.getReviewsForBusiness(
        1,
        {
          limit: 2,
          offset: 1,
        },
        { asc: true, field: "rating" },
      );

      expect(reviews).toHaveLength(2);
      expect(reviews[0].reviewId).toBe(mockReviews[0].reviewId);
      expect(reviews[0].title).toBe(mockReviews[0].title);
      expect(reviews[1].rating).toBe(mockReviews[1].rating);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("select"),
        expect.any(Object),
      );
    });

    it("Should return empty array if no reviews exist", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const reviews = await repo.getReviewsForBusiness(
        1,
        {
          limit: 2,
          offset: 1,
        },
        { asc: true, field: "rating" },
      );

      expect(reviews).toEqual([]);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if query fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      expect(
        repo.getReviewsForBusiness(
          1,
          {
            limit: 2,
            offset: 1,
          },
          { asc: true, field: "rating" },
        ),
      ).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRatingsForBusiness", () => {
    it("Should return ratings for a business", async () => {
      const mockRatings = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];

      mockDb.query.mockResolvedValueOnce({
        rows: mockRatings,
        rowCount: 3,
      });

      const ratings = await repo.getRatingsForBusiness(1);

      expect(ratings).toEqual([5, 4, 5]);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("select rating"),
        expect.any(Object),
      );
    });

    it("Should return empty array if no ratings exist", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      });

      const ratings = await repo.getRatingsForBusiness(1);

      expect(ratings).toEqual([]);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if query fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      expect(repo.getRatingsForBusiness(1)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });
});
