import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { InvalidCredentialsError } from "@/common/errors/invalid-credentials";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { UserService } from "@/core/application/services/user.service";
import { User } from "@/core/domain/entities/user";
import type { UserApiPort } from "@/ports/input/user";
import {
	type MockJwtService,
	createMockJwtService,
} from "test/helpers/mock-jwt-service";
import {
	type MockPasswordService,
	createMockPasswordService,
} from "test/helpers/mock-password-service";
import {
	type MockUserRepository,
	createMockUserRepository,
} from "test/helpers/mock-user-repository";

describe("User service", () => {
	let mockUserRepo: MockUserRepository;
	let mockPasswordService: MockPasswordService;
	let mockJwtService: MockJwtService;

	let service: UserApiPort;

	beforeEach(() => {
		mockUserRepo = createMockUserRepository();
		mockPasswordService = createMockPasswordService();
		mockJwtService = createMockJwtService();

		service = new UserService(
			mockUserRepo,
			mockPasswordService,
			mockJwtService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("registerUser", () => {
		it("Should create a user with provided data", async () => {
			const user = {
				email: "test",
				password: "test",
				role: "BUSINESS" as const,
			};
			mockPasswordService.hashPassword.mockReturnValueOnce(
				Promise.resolve("test"),
			);

			mockUserRepo.create.mockReturnValueOnce(Promise.resolve(1));

			const userId = await service.registerUser(user);

			expect(userId).toBe(1);
			expect(mockPasswordService.hashPassword).toHaveBeenCalledTimes(1);
			expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
		});

		it("Should throw an error if user already exists", async () => {
			const user = {
				email: "test",
				password: "test",
				role: "BUSINESS" as const,
			};

			mockUserRepo.getByEmail.mockResolvedValueOnce(new User({ ...user }));

			expect(service.registerUser(user)).rejects.toThrowError(
				ResourceAlreadyExists,
			);
		});

		it("Should handle error cases from password service", async () => {
			const error = new Error("Password service Error");
			const user = {
				email: "test",
				password: "test",
				role: "BUSINESS" as const,
			};
			mockPasswordService.hashPassword.mockRejectedValueOnce(error);

			expect(service.registerUser(user)).rejects.toThrow(
				"Password service Error",
			);
			expect(mockPasswordService.hashPassword).toHaveBeenCalledTimes(1);
			expect(mockUserRepo.create).toHaveBeenCalledTimes(0);
		});

		it("Should handle error cases from user repository", async () => {
			const user = {
				email: "test",
				password: "test",
				role: "BUSINESS" as const,
			};

			mockUserRepo.create.mockRejectedValueOnce(
				new Error("User repository Error"),
			);

			expect(service.registerUser(user)).rejects.toThrow(
				"User repository Error",
			);
			expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("loginUser", () => {
		it("Should successfully login a user with valid credentials", async () => {
			const user = {
				email: "test",
				password: "test",
			};

			mockUserRepo.getByEmail.mockResolvedValueOnce(
				new User({ ...user, role: "BUSINESS", userId: 1 }),
			);

			mockPasswordService.comparePassword.mockResolvedValueOnce(true);

			mockJwtService.sign.mockResolvedValueOnce("token");

			const token = await service.loginUser(user);

			expect(token).toBe("token");
			expect(mockPasswordService.comparePassword).toHaveBeenCalledTimes(1);
			expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
			expect(mockJwtService.sign).toHaveBeenCalledWith({
				email: user.email,
				userId: 1,
				role: "BUSINESS",
			});
		});

		it("Should throw InvalidCredentialsError when password is wrong", () => {
			const user = {
				email: "test",
				password: "test",
			};

			mockUserRepo.getByEmail.mockResolvedValueOnce(
				new User({ ...user, role: "BUSINESS", userId: 1 }),
			);

			mockPasswordService.comparePassword.mockResolvedValueOnce(false);

			expect(service.loginUser(user)).rejects.toThrowError(
				InvalidCredentialsError,
			);
			expect(mockPasswordService.comparePassword).toHaveBeenCalledTimes(1);
			expect(mockJwtService.sign).toHaveBeenCalledTimes(0);
		});

		it("Should throw an error when user email doesn't exist", () => {
			const user = {
				email: "test",
				password: "test",
			};

			mockUserRepo.getByEmail.mockRejectedValue(new Error("user not found"));

			expect(service.loginUser(user)).rejects.toThrowError("user not found");
			expect(mockUserRepo.getByEmail).toHaveBeenCalledTimes(1);
			expect(mockPasswordService.comparePassword).toHaveBeenCalledTimes(0);
			expect(mockJwtService.sign).toHaveBeenCalledTimes(0);
		});

		it("Should handle error cases from JWT service", () => {
			const user = {
				email: "test",
				password: "test",
			};

			mockUserRepo.getByEmail.mockResolvedValueOnce(
				new User({ ...user, role: "BUSINESS", userId: 1 }),
			);
			mockPasswordService.comparePassword.mockResolvedValueOnce(true);

			mockJwtService.sign.mockRejectedValue(new Error("invalid payload"));

			expect(service.loginUser(user)).rejects.toThrowError("invalid payload");
			expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
			expect(mockUserRepo.getByEmail).toHaveBeenCalledTimes(1);
			expect(mockPasswordService.comparePassword).toHaveBeenCalledTimes(1);
		});

		it("Should handle error cases from password service", () => {
			const user = {
				email: "test",
				password: "test",
			};

			mockUserRepo.getByEmail.mockResolvedValueOnce(
				new User({ ...user, role: "BUSINESS", userId: 1 }),
			);

			mockPasswordService.comparePassword.mockRejectedValue(
				new Error("compare error"),
			);

			expect(service.loginUser(user)).rejects.toThrowError("compare error");
			expect(mockPasswordService.comparePassword).toHaveBeenCalledTimes(1);
			expect(mockUserRepo.getByEmail).toHaveBeenCalledTimes(1);
			expect(mockJwtService.sign).toHaveBeenCalledTimes(0);
		});
	});
});
