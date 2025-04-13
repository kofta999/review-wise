import type { LoginUserDTO } from "@/common/dtos/login-user.dto";
import { Logger } from "@/common/util/logger";
import type { IUserRepository } from "@/data-access/interfaces/user.repository.interface";
import { User } from "@/domain/entities/user";
import type { IPasswordService } from "./interfaces/password.service.interface";
import type { IUserService } from "./interfaces/user.service.interface";

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private passwordService: IPasswordService;
  private logger = Logger.getLogger();

  constructor(
    userRepository: IUserRepository,
    passwordService: IPasswordService,
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  async registerUser(
    newUser: Pick<User, "email" | "password" | "role">,
  ): Promise<number> {
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

  loginUser(dto: LoginUserDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
