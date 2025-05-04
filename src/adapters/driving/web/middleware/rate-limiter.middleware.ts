import { BaseApiError } from "@/common/errors/base-api-error";
import type { Context } from "hono";
import { rateLimiter } from "hono-rate-limiter";

const getIpAddress = async (c: Context) => {
	if (process.env.VERCEL === "1") {
		const { getConnInfo } = await import("hono/vercel");
		return getConnInfo(c).remote.address || "unknown";
	}
	const { getConnInfo } = await import("hono/bun");
	return getConnInfo(c).remote.address || "unknown";
};

export const rateLimiterMiddleware = (limit: number, windowMs?: number) =>
	rateLimiter({
		limit,
		windowMs,
		keyGenerator: (c) => `${getIpAddress(c)}#${c.req.path}`,
		handler: () => {
			throw new BaseApiError(429, "Too many requests, please try again later");
		},
	});
