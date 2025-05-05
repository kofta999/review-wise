import type { LoginUserPort } from "@/ports/input/user/login-user.port";
import type { RegisterUserPort } from "@/ports/input/user/register-user.port";

export interface UserApiPort extends RegisterUserPort, LoginUserPort {}
