import type { LoginUserDTO } from "@/common/dtos/login-user.dto";
import { InvalidCredentialsError } from "@/common/errors/invalid-credentials";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { UserNotFoundError } from "@/common/errors/user-not-found";
import { TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import { User } from "@/core/domain/entities/user";
import type { UserApiPort } from "@/ports/input/user";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import type { JwtPort } from "@/ports/output/security/jwt.port";
import type { PasswordPort } from "@/ports/output/security/password.port";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements UserApiPort {
	private userRepository: UserRepositoryPort;
	private passwordService: PasswordPort;
	private jwtService: JwtPort;
	private logger = Logger.getLogger();

	constructor(
		@inject(TYPES.UserRepositoryPort) userRepository: UserRepositoryPort,
		@inject(TYPES.PasswordPort) passwordService: PasswordPort,
		@inject(TYPES.JwtPort) jwtService: JwtPort,
	) {
		this.userRepository = userRepository;
		this.passwordService = passwordService;
		this.jwtService = jwtService;
	}

	async registerUser(
		newUser: Pick<User, "email" | "password" | "role">,
	): Promise<number> {
		const maybeUser = await this.userRepository.getByEmail(newUser.email);

		if (maybeUser) {
			throw new ResourceAlreadyExists("User");
		}

		const hashedPassword = await this.passwordService.hashPassword(
			newUser.password,
		);

		const user = new User({
			email: newUser.email,
			password: hashedPassword,
			role: newUser.role,
		});

		const res = await this.userRepository.create(user);

		this.logger.info(`User with ID ${res} has been created`);

		return res;
	}

	async loginUser(dto: LoginUserDTO): Promise<string> {
		const user = await this.userRepository.getByEmail(dto.email);

		if (!user) {
			throw new UserNotFoundError();
		}

		const isPasswordValid = await this.passwordService.comparePassword(
			dto.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		const token = await this.jwtService.sign({
			email: user.email,
			userId: user.userId,
			role: user.role,
		});

		this.logger.info(`User with ID ${user.userId} has logged in`);

		return token;
	}
}
