import { BaseApiError } from "@/common/errors/base-error";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (err, c) => {
	let [statusCode, errorMessage]: [ContentfulStatusCode, string] = [
		500,
		"Internal Server Error",
	];

	if (err instanceof BaseApiError) {
		[statusCode, errorMessage] = [err.code, err.message];
	}

	return c.json({ message: errorMessage }, statusCode);
};
