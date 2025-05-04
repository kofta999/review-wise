import { type AppRouteHandler, TYPES } from "@/common/types";
import { inject } from "inversify";
import type { LoginRoute } from "../routes/auth.routes";
import type { UserApiPort } from "@/ports/input/user";

export class AuthController {
	constructor(@inject(TYPES.UserApiPort) private userService: UserApiPort) {}

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
