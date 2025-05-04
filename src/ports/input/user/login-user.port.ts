import type { LoginUserDTO } from "@/common/dtos/login-user.dto";

export interface LoginUserPort {
	loginUser(dto: LoginUserDTO): Promise<string>;
}
