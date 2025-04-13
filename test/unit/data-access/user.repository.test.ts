import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import { UserNotFoundError } from "@/common/errors/user-not-found";
import { BusinessRepository } from "@/data-access/business.repository";
import type { IUserRepository } from "@/data-access/interfaces/user.repository.interface";
import { UserRepository } from "@/data-access/user.repository";
import { Business } from "@/domain/entities/business";
import { User } from "@/domain/entities/user";
import {
  type MockDatabaseConnection,
  createMockDatabaseConnection,
} from "test/helpers/mock-db-connection";

describe("User repository", () => {
  let mockDb: MockDatabaseConnection;
  let repo: IUserRepository;

  beforeEach(() => {
    mockDb = createMockDatabaseConnection();
    repo = new UserRepository(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("Should create a user and return userId", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [{ user_id: 1 }],
        rowCount: 1,
      });

      const user = new User({
        email: "test",
        password: "test",
        role: "BUSINESS",
      });

      const userId = await repo.create(user);

      expect(userId).toBe(1);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('insert into "user"'),
        expect.any(Object),
      );
    });

    it("Should throw error if user creation fails", async () => {
      const dbError = new Error("Database error");
      mockDb.query.mockRejectedValueOnce(dbError);

      const user = new User({
        email: "test",
        password: "test",
        role: "BUSINESS",
      });

      expect(repo.create(user)).rejects.toThrow("Database error");
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("Should get a user by its ID", async () => {
      const mockUserData = {
        user_id: 1,
        email: "test",
        password: "test",
        role: "BUSINESS",
      };

      mockDb.query.mockResolvedValueOnce({
        rows: [mockUserData],
        rowCount: 1,
      });

      const userId = 1;

      const user = await repo.getById(userId);

      expect(user).toBeInstanceOf(User);
      expect(user.userId).toBe(mockUserData.user_id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('from "user"'),
        expect.any(Object),
      );
    });

    it("Should throw error if user is not found", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [], // Empty result
        rowCount: 0,
      });

      expect(repo.getById(999)).rejects.toThrow(UserNotFoundError);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if database query fails", async () => {
      expect(repo.getById(1)).rejects.toThrow();
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("getByEmail", () => {
    it("Should get a user by its email", async () => {
      const mockUserData = {
        user_id: 1,
        email: "test",
        password: "test",
        role: "BUSINESS",
      };

      mockDb.query.mockResolvedValueOnce({
        rows: [mockUserData],
        rowCount: 1,
      });

      const email = "test";

      const user = await repo.getByEmail(email);

      expect(user).toBeInstanceOf(User);
      expect(user.userId).toBe(mockUserData.user_id);
      expect(user.email).toBe(mockUserData.email);
      expect(user.password).toBe(mockUserData.password);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('from "user"'),
        expect.any(Object),
      );
    });

    it("Should throw error if user is not found", async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [], // Empty result
        rowCount: 0,
      });

      expect(repo.getByEmail("test")).rejects.toThrow(UserNotFoundError);
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if database query fails", async () => {
      expect(repo.getByEmail("test")).rejects.toThrow();
      expect(mockDb.query).toHaveBeenCalledTimes(1);
    });
  });
});
