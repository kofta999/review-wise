import type { IBusinessService } from "@/business/interfaces/business.service.interface";
import type { IReviewService } from "@/business/interfaces/review.service.interface";
import type { AppRouteHandler } from "@/common/types";
import type {
  GetByIdRoute,
  GetReviewsRoute,
  RegisterRoute,
} from "../routes/business.routes";

export class BusinessController {
  private businessService: IBusinessService;
  private reviewService: IReviewService;

  constructor(
    businessService: IBusinessService,
    reviewService: IReviewService,
  ) {
    this.businessService = businessService;
    this.reviewService = reviewService;
  }

  register: AppRouteHandler<RegisterRoute> = async (c) => {
    const body = c.req.valid("json");

    const businessId = await this.businessService.registerBusiness(body);

    return c.json(
      {
        businessId,
      },
      201,
    );
  };

  getById: AppRouteHandler<GetByIdRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const business = await this.businessService.getBusinessById(id);

    return c.json(business, 200);
  };

  getReviews: AppRouteHandler<GetReviewsRoute> = async (c) => {
    const { id } = c.req.valid("param");

    const business = await this.reviewService.getReviewsForBusiness(id);

    return c.json(business, 200);
  };
}
