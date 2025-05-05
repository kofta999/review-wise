import { LoginUserSchema } from "@/common/dtos/login-user.dto";
import { RegisterBusinessSchema } from "@/common/dtos/register-business.dto";
import jsonContent from "@/common/util/json-content";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const tags = ["Authentication"];

export const login = createRoute({
	path: "/login",
	method: "post",
	tags,
	summary: "Login",
	request: {
		body: jsonContent(LoginUserSchema, "Logging in user's data"),
	},
	responses: {
		200: jsonContent(
			z.object({
				token: z.string(),
			}),
			"The JWT token",
		),
	},
});

export type LoginRoute = typeof login;
