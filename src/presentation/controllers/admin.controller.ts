import type { IBusinessService } from "@/business/interfaces/business.service.interface";
import type { IReviewService } from "@/business/interfaces/review.service.interface";
import type { AppRouteHandler } from "@/common/types";
import type {
  DeleteBusinessRoute,
  DeleteReviewRoute,
} from "../routes/admin.routes";

export class AdminController {
  private businessService: IBusinessService;
  private reviewService: IReviewService;

  constructor(
    businessService: IBusinessService,
    reviewService: IReviewService,
  ) {
    this.businessService = businessService;
    this.reviewService = reviewService;
  }

  deleteBusiness: AppRouteHandler<DeleteBusinessRoute> = async (c) => {
    const { id } = c.req.valid("param");

    await this.businessService.adminRemoveBusiness(id);

    c.status(204);
    return c.json({});
  };

  deleteReview: AppRouteHandler<DeleteReviewRoute> = async (c) => {
    const { id } = c.req.valid("param");

    await this.reviewService.adminRemoveReview(id);

    c.status(204);
    return c.json({});
  };
}
