import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { BusinessDatabaseRepository } from "@/adapters/driven/database/repositories/business/business.database.repository";
import { Business } from "@/core/domain/entities/business";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import {
	type MockDatabaseConnection,
	createMockDatabaseConnection,
} from "test/helpers/mock-db-connection";

describe("Business database repository", () => {
	let mockDb: MockDatabaseConnection;
	let repo: BusinessDatabaseRepository;

	beforeEach(() => {
		mockDb = createMockDatabaseConnection();
		repo = new BusinessDatabaseRepository(mockDb);
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

			const business = new Business({
				name: "test",
				description: "test",
				userId: 1,
			});

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

			const business = new Business({
				name: "test",
				description: "test",
				userId: 1,
			});

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

			expect(business).not.toBeNull();
			expect(business).toBeInstanceOf(Business);
			expect(business?.businessId).toBe(mockBusinessData.businessId);
			expect(business?.name).toBe(mockBusinessData.name);
			expect(business?.description).toBe(mockBusinessData.description);
			expect(mockDb.query).toHaveBeenCalledTimes(1);
			expect(mockDb.query).toHaveBeenCalledWith(
				expect.stringContaining("select"),
				expect.any(Object),
			);
		});

		it("Should return null if business is not found", async () => {
			mockDb.query.mockResolvedValueOnce({
				rows: [], // Empty result
				rowCount: 0,
			});

			expect(repo.getById(999)).resolves.toBeNull();
			expect(mockDb.query).toHaveBeenCalledTimes(1);
		});

		it("Should throw error if database query fails", async () => {
			expect(repo.getById(1)).rejects.toThrow();
			expect(mockDb.query).toHaveBeenCalledTimes(1);
		});
	});

	describe("exists", () => {
		it("Should return true if business exists", async () => {
			// Mock the database response for an existing business
			mockDb.query.mockResolvedValueOnce({
				rows: [{ exists: 1 }],
				rowCount: 1,
			});

			const businessId = 123;
			const result = await repo.exists(businessId);

			// Assert the result is true
			expect(result).toBe(true);

			// Verify the query was called correctly
			expect(mockDb.query).toHaveBeenCalledTimes(1);
			expect(mockDb.query).toHaveBeenCalledWith(
				expect.stringContaining('select 1 as "exists" from business'),
				expect.any(Object),
			);
		});

		it("Should return false if business does not exist", async () => {
			// Mock the database response for a non-existing business (empty result)
			mockDb.query.mockResolvedValueOnce({
				rows: [],
				rowCount: 0,
			});

			const nonExistentBusinessId = 999;
			const result = await repo.exists(nonExistentBusinessId);

			// Assert the result is false
			expect(result).toBe(false);
			expect(mockDb.query).toHaveBeenCalledTimes(1);
		});

		it("Should throw error if query fails", async () => {
			// Mock database error
			const dbError = new Error("Database error");
			mockDb.query.mockRejectedValueOnce(dbError);

			const businessId = 123;

			// Assert the method throws the expected error
			expect(repo.exists(businessId)).rejects.toThrow("Database error");
			expect(mockDb.query).toHaveBeenCalledTimes(1);
		});
	});
});
