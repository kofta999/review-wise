import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  spyOn,
} from "bun:test";
import { BusinessService } from "@/business/business.service";
import type { IBusinessService } from "@/business/interfaces/business.service.interface";
import { Business } from "@/domain/entities/business";
import {
  type MockBusinessRepository,
  createMockBusinessRepository,
} from "test/helpers/mock-business-repository";
import {
  type MockReviewRepository,
  createMockReviewRepository,
} from "test/helpers/mock-review-repository";

describe("Business service", () => {
  let mockBusinessRepo: MockBusinessRepository;
  let mockReviewRepo: MockReviewRepository;
  let service: IBusinessService;

  beforeEach(() => {
    mockBusinessRepo = createMockBusinessRepository();
    mockReviewRepo = createMockReviewRepository();

    service = new BusinessService(mockBusinessRepo, mockReviewRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerBusiness", () => {
    it("Should register business and return business id", async () => {
      const newBusiness = {
        name: "Test Business",
        description: "A test business",
        userId: 1,
      };

      mockBusinessRepo.create.mockResolvedValueOnce(1);

      const businessId = await service.registerBusiness(newBusiness);

      expect(businessId).toBe(1);
      expect(mockBusinessRepo.create).toHaveBeenCalledTimes(1);
      expect(mockBusinessRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: newBusiness.name,
          description: newBusiness.description,
          userId: newBusiness.userId,
        }),
      );
    });

    it("Should handle error cases from business repository", async () => {
      const newBusiness = {
        name: "Test Business",
        description: "A test business",
        userId: 1,
      };

      mockBusinessRepo.create.mockRejectedValueOnce(
        new Error("database error"),
      );

      expect(service.registerBusiness(newBusiness)).rejects.toThrowError(
        "database error",
      );
      expect(mockBusinessRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("getBusinessById", () => {
    it("Should get business details with average rating", async () => {
      const businessId = 1;
      const businessMock = new Business({
        businessId,
        name: "Test Business",
        description: "A test business",
        userId: 1,
      });
      const ratingsMock = [4, 5, 3]; // Mock ratings

      mockBusinessRepo.getById.mockResolvedValueOnce(businessMock);
      mockReviewRepo.getRatingsForBusiness.mockResolvedValueOnce(ratingsMock);

      // Spy on the calculateAverageRating method
      const calculateSpy = spyOn(businessMock, "calculateAverageRating");
      calculateSpy.mockReturnValueOnce(4); // Mock average rating

      const business = await service.getBusinessById(businessId);

      expect(business).toEqual({
        businessId,
        name: businessMock.name,
        description: businessMock.description,
        averageRating: 4,
      });

      expect(mockBusinessRepo.getById).toHaveBeenCalledTimes(1);
      expect(mockBusinessRepo.getById).toHaveBeenCalledWith(businessId);
      expect(mockReviewRepo.getRatingsForBusiness).toHaveBeenCalledTimes(1);
      expect(mockReviewRepo.getRatingsForBusiness).toHaveBeenCalledWith(
        businessId,
      );
      expect(calculateSpy).toHaveBeenCalledWith(ratingsMock);
    });

    it("Should handle error cases from business repository", async () => {
      mockBusinessRepo.getById.mockRejectedValueOnce(
        new Error("database error"),
      );

      expect(service.getBusinessById(1)).rejects.toThrowError("database error");
      expect(mockBusinessRepo.getById).toHaveBeenCalledTimes(1);
    });

    it("Should handle error cases from review repository", async () => {
      const businessMock = new Business({
        businessId: 1,
        name: "Test Business",
        description: "A test business",
        userId: 1,
      });

      mockBusinessRepo.getById.mockResolvedValueOnce(businessMock);
      mockReviewRepo.getRatingsForBusiness.mockRejectedValueOnce(
        new Error("database error"),
      );

      expect(service.getBusinessById(1)).rejects.toThrowError("database error");
      expect(mockBusinessRepo.getById).toHaveBeenCalledTimes(1);
      expect(mockReviewRepo.getRatingsForBusiness).toHaveBeenCalledTimes(1);
    });
  });

  describe("adminRemoveBusiness", () => {
    it("Should remove a business for a businessId", async () => {
      mockBusinessRepo.remove.mockResolvedValueOnce();

      expect(service.adminRemoveBusiness(1)).resolves;
      expect(mockBusinessRepo.remove).toHaveBeenCalledTimes(1);
    });

    it("Should handle error cases from business repository", async () => {
      mockBusinessRepo.remove.mockRejectedValueOnce(
        new Error("database error"),
      );

      expect(service.adminRemoveBusiness(1)).rejects.toThrow("database error");
      expect(mockBusinessRepo.remove).toHaveBeenCalledTimes(1);
    });
  });
});
