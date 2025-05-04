import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import { BaseApiError } from "@/common/errors/base-error";
import { type AppRouteHandler, TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import type { BusinessApiPort } from "@/ports/input/business";
import type { ReviewApiPort } from "@/ports/input/review";
import type { UserApiPort } from "@/ports/input/user";
import type { CachePort } from "@/ports/output/cache/cache.port";
import { inject } from "inversify";
import type {
	GetByIdRoute,
	GetReviewsRoute,
	RegisterRoute,
	SubmitReviewRoute,
} from "../routes/business.routes";

export class BusinessController {
	private logger = Logger.getLogger();

	constructor(
		@inject(TYPES.BusinessApiPort) private businessService: BusinessApiPort,
		@inject(TYPES.ReviewApiPort) private reviewService: ReviewApiPort,
		@inject(TYPES.UserApiPort) private userService: UserApiPort,
		@inject(TYPES.CachePort) private cacheService: CachePort,
	) {}

	register: AppRouteHandler<RegisterRoute> = async (c) => {
		const { description, email, name, password } = c.req.valid("json");

		const userId = await this.userService.registerUser({
			email,
			password,
			role: "BUSINESS",
		});

		const businessId = await this.businessService.registerBusiness({
			userId,
			name,
			description,
		});

		return c.json(
			{
				businessId,
			},
			201,
		);
	};

	getById: AppRouteHandler<GetByIdRoute> = async (c) => {
		const { id } = c.req.valid("param");

		const cacheKey = `businesses:${id}`;

		const cached = await this.cacheService.get<GetBusinessDTO>(cacheKey);

		if (cached) {
			this.logger.info(`Fetched business with ID ${id} from cache`);
			return c.json(cached, 200);
		}

		const business = await this.businessService.getBusinessById(id);

		this.cacheService.set(cacheKey, business);

		this.logger.info(`Added business with ID ${id} to cache`);

		return c.json(business, 200);
	};

	getReviews: AppRouteHandler<GetReviewsRoute> = async (c) => {
		const { id } = c.req.valid("param");
		const { limit, page, sort } = c.req.valid("query");

		// Already validated
		const sortOrder = sort[0] as "+" | "-";
		const sortField = sort.substring(1) as "date" | "rating";

		const cacheKey = `businesses:${id}:reviews:${sort}:${page}:${limit}`;

		const cached = await this.cacheService.get<GetBusinessReviewsDTO>(cacheKey);

		if (cached) {
			this.logger.info(`Fetched reviews for business with ID ${id} from cache`);
			return c.json(cached, 200);
		}

		const business = await this.reviewService.getReviewsForBusiness(id, {
			pagination: { limit, page },
			sorting: { asc: sortOrder === "+", field: sortField },
		});

		this.cacheService.set(cacheKey, business);
		this.logger.info(`Added reviews for business with ID ${id} to cache`);

		return c.json(business, 200);
	};

	submitReview: AppRouteHandler<SubmitReviewRoute> = async (c) => {
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		if (id !== body.businessId) {
			throw new BaseApiError(
				400,
				`Business ID of params ${id} does not match request body's ID ${body.businessId}`,
			);
		}

		const reviewId = await this.reviewService.reviewBusiness(body);

		this.cacheService.delByPattern(`businesses:${id}:reviews`);

		return c.json({ reviewId }, 201);
	};
}
