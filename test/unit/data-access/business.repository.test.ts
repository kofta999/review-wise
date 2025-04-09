import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import { BusinessRepository } from "@/data-access/business.repository";
import { Business } from "@/domain/entities/business";
import {
  type MockDatabaseConnection,
  createMockDatabaseConnection,
} from "test/helpers/mock-db-connection";

describe("Business repository", () => {
  let mockDb: MockDatabaseConnection;
  let repo: BusinessRepository;

  beforeEach(() => {
    mockDb = createMockDatabaseConnection();
    repo = new BusinessRepository(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("Should create a business and return businessId", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [{ business_id: 1 }],
        rowCount: 1,
      });

      const business = new Business({ name: "test", description: "test" });

      const businessId = await repo.create(business);

      expect(businessId).toBe(1);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("insert into business"),
        expect.any(Object),
      );
    });

    it("Should throw error if business creation fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      const business = new Business({ name: "test", description: "test" });

      expect(repo.create(business)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("remove", () => {
    it("Should remove a business", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 1,
      });

      const businessId = 1;

      await repo.remove(businessId);

      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("delete from business"),
        expect.any(Object),
      );
    });

    it("Should not throw error if business doesn't exist", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0, // No rows affected
      });

      const businessId = 999; // Non-existent ID

      expect(repo.remove(businessId)).resolves;
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if business removal fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      const businessId = 1;

      expect(repo.remove(businessId)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("Should return a business by ID", async () => {
      const mockBusinessData = {
        businessId: 1,
        name: "Test Business",
        description: "A test business description",
      };

      mockDb.query.mockResolvedValueOnce({
        rows: [mockBusinessData],
        rowCount: 1,
      });

      const business = await repo.getById(1);

      expect(business).toBeInstanceOf(Business);
      expect(business.businessId).toBe(mockBusinessData.businessId);
      expect(business.name).toBe(mockBusinessData.name);
      expect(business.description).toBe(mockBusinessData.description);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("select"),
        expect.any(Object),
      );
    });

    it("Should throw error if business is not found", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [], // Empty result
        rowCount: 0,
      });

      expect(repo.getById(999)).rejects.toThrow(BusinessNotFoundError);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if database query fails", async () => {
      expect(repo.getById(1)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getReviews", () => {
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

      const reviews = await repo.getReviews(1);

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

      const reviews = await repo.getReviews(1);

      expect(reviews).toEqual([]);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if query fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      expect(repo.getReviews(1)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRatings", () => {
    it("Should return ratings for a business", async () => {
      const mockRatings = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];

      mockDb.query.mockResolvedValueOnce({
        rows: mockRatings,
        rowCount: 3,
      });

      const ratings = await repo.getRatings(1);

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

      const ratings = await repo.getRatings(1);

      expect(ratings).toEqual([]);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if query fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      expect(repo.getRatings(1)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });
});
