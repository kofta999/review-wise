import type { LoginUserDTO } from "@/common/dtos/login-user.dto";
import type { User } from "@/domain/entities/user";

export interface IUserService {
  registerUser(
    newUser: Pick<User, "email" | "password" | "role">,
  ): Promise<number>;
  loginUser(dto: LoginUserDTO): Promise<void>;
}
