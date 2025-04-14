import type { IBusinessService } from "@/business/interfaces/business.service.interface";
import type { IReviewService } from "@/business/interfaces/review.service.interface";
import type { IUserService } from "@/business/interfaces/user.service.interface";
import { BaseApiError } from "@/common/errors/base-error";
import type { AppRouteHandler } from "@/common/types";
import type {
  GetByIdRoute,
  GetReviewsRoute,
  RegisterRoute,
  SubmitReviewRoute,
} from "../routes/business.routes";

export class BusinessController {
  private businessService: IBusinessService;
  private reviewService: IReviewService;
  private userService: IUserService;

  constructor(
    businessService: IBusinessService,
    reviewService: IReviewService,
    userService: IUserService,
  ) {
    this.businessService = businessService;
    this.reviewService = reviewService;
    this.userService = userService;
  }

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

    const business = await this.businessService.getBusinessById(id);

    return c.json(business, 200);
  };

  getReviews: AppRouteHandler<GetReviewsRoute> = async (c) => {
    const { id } = c.req.valid("param");
    const { limit, page, sort } = c.req.valid("query");

    // Already validated
    const sortOrder = sort[0] as "+" | "-";
    const sortField = sort.substring(1) as "date" | "rating";

    const business = await this.reviewService.getReviewsForBusiness(id, {
      pagination: { limit, page },
      sorting: { asc: sortOrder === "+", field: sortField },
    });

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

    return c.json({ reviewId }, 201);
  };
}
