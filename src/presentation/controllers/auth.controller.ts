import type { IUserService } from "@/business/interfaces/user.service.interface";
import type { AppRouteHandler } from "@/common/types";
import type { LoginRoute } from "../routes/auth.routes";

export class AuthController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  login: AppRouteHandler<LoginRoute> = async (c) => {
    const { email, password } = c.req.valid("json");

    const token = await this.userService.loginUser({
      email,
      password,
    });

    return c.json(
      {
        token,
      },
      200,
    );
  };
}
