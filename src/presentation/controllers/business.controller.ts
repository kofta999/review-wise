import type { BusinessService } from "@/business/business.service";
import type { AppRouteHandler } from "@/common/types";
import type {
  GetByIdRoute,
  GetReviewsRoute,
  RegisterRoute,
} from "../routes/business.routes";

export class BusinessController {
  private businessService: BusinessService;

  constructor(businessService: BusinessService) {
    this.businessService = businessService;
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

    const business = await this.businessService.getBusinessReviews(id);

    return c.json(business, 200);
  };
}
