import { type AppRouteHandler, TYPES } from "@/common/types";
import type { BusinessApiPort } from "@/ports/input/business";
import type { ReviewApiPort } from "@/ports/input/review";
import { inject } from "inversify";
import type {
	DeleteBusinessRoute,
	DeleteReviewRoute,
} from "../routes/admin.routes";

export class AdminController {
	constructor(
		@inject(TYPES.BusinessApiPort) private businessService: BusinessApiPort,
		@inject(TYPES.ReviewApiPort) private reviewService: ReviewApiPort,
	) {}

	deleteBusiness: AppRouteHandler<DeleteBusinessRoute> = async (c) => {
		const { id } = c.req.valid("param");

		await this.businessService.removeBusiness(id);

		c.status(204);
		return c.json({});
	};

	deleteReview: AppRouteHandler<DeleteReviewRoute> = async (c) => {
		const { id } = c.req.valid("param");

		await this.reviewService.removeReview(id);

		c.status(204);
		return c.json({});
	};
}
