import type { LoginUserDTO } from "@/common/dtos/login-user.dto";
import { InvalidCredentialsError } from "@/common/errors/invalid-credentials";
import { ResourceAlreadyExists } from "@/common/errors/resource-already-exists";
import { UserNotFoundError } from "@/common/errors/user-not-found";
import { TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import type { IUserRepository } from "@/data-access/interfaces/user.repository.interface";
import { User } from "@/domain/entities/user";
import { inject, injectable } from "inversify";
import type { IJwtService } from "./interfaces/jwt.service.interface";
import type { IPasswordService } from "./interfaces/password.service.interface";
import type { IUserService } from "./interfaces/user.service.interface";

@injectable()
export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private passwordService: IPasswordService;
  private jwtService: IJwtService;
  private logger = Logger.getLogger();

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.IPasswordService) passwordService: IPasswordService,
    @inject(TYPES.IJwtService) jwtService: IJwtService,
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
