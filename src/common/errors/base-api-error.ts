import type { ContentfulStatusCode } from "hono/utils/http-status";

export class BaseApiError extends Error {
	code: ContentfulStatusCode;

	constructor(code: ContentfulStatusCode, message: string) {
		super(message);
		this.code = code;
	}
}
