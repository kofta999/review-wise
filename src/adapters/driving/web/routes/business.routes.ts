import { rateLimiterMiddleware } from "@/adapters/driving/web/middleware/rate-limiter.middleware";
import { GetBusinessReviewsSchema } from "@/common/dtos/get-business-reviews.dto";
import { GetBusinessSchema } from "@/common/dtos/get-business.dto";
import { RegisterBusinessSchema } from "@/common/dtos/register-business.dto";
import { ReviewBusinessSchema } from "@/common/dtos/review-business.dto";
import { BaseError } from "@/common/errors/base-error";
import { ErrorSchema } from "@/common/schemas/error-schema";
import { IdSchema } from "@/common/schemas/id-schema";
import jsonContent from "@/common/util/json-content";
import { createRoute, z } from "@hono/zod-openapi";

const tags = ["Business"];

export const register = createRoute({
	path: "/",
	method: "post",
	tags,
	summary: "Register",
	request: {
		body: jsonContent(RegisterBusinessSchema, "The business to register"),
	},
	responses: {
		201: jsonContent(
			z.object({
				businessId: z.number(),
			}),
			"The registered business's ID",
		),
	},
});

export type RegisterRoute = typeof register;

export const getById = createRoute({
	path: "/{id}",
	method: "get",
	tags,
	summary: "Get by Id",
	request: {
		params: IdSchema,
	},
	responses: {
		200: jsonContent(GetBusinessSchema, "The business's details"),
		404: jsonContent(ErrorSchema, "Business not found"),
	},
});

export type GetByIdRoute = typeof getById;

export const getReviews = createRoute({
	path: "/{id}/reviews",
	method: "get",
	tags,
	summary: "Get Reviews",
	request: {
		params: IdSchema,
		query: z.object({
			page: z.coerce.number().optional().default(1),
			limit: z.coerce.number().optional().default(5),
			sort: z
				.string()
				.regex(
					/^(\+|\-)(date|rating)$/i,
					"Should be on format (+|-)(rating|date), where + is ascending, example +rating",
				)
				.optional()
				.default("+date"),
		}),
	},
	responses: {
		200: jsonContent(GetBusinessReviewsSchema, "The business's reviews"),
		404: jsonContent(ErrorSchema, "Business not found"),
	},
});

export type GetReviewsRoute = typeof getReviews;

export const submitReview = createRoute({
	path: "/{id}/reviews",
	method: "post",
	tags,
	middleware: [rateLimiterMiddleware(5, 24 * 60 * 60 * 1000)] as const,
	summary: "Submit a review",
	request: {
		params: IdSchema,
		body: jsonContent(ReviewBusinessSchema, "The review body"),
	},
	responses: {
		201: jsonContent(
			z.object({
				reviewId: z.number(),
			}),
			"The created review's ID",
		),
		404: jsonContent(ErrorSchema, "Business not found"),
	},
});

export type SubmitReviewRoute = typeof submitReview;
