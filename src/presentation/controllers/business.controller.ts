import type { BusinessService } from "@/business/business.service";
import type { AppRouteHandler } from "@/common/types";
import type { RegisterRoute } from "../routes/business.routes";

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
}
