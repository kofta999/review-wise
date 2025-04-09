import { BusinessNotFoundError } from "@/common/exceptions/business-not-found";
import type { Rating } from "@/common/types";
import { Business } from "@/domain/entities/business";
import type { Review } from "@/domain/entities/review";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type {
  ICreateBusinessQuery,
  IGetBusinessByIdQuery,
  IGetRatingsForBusinessQuery,
  IGetReviewsForBusinessQuery,
  IRemoveBusinessQuery,
} from "./types/business.repository.types";

export class BusinessRepository {
  db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
  }

  async create(business: Business): Promise<number> {
    const createBusiness = sql<ICreateBusinessQuery>`insert into business(name, description) values ($name, $description) returning business_id`;

    const res = await createBusiness.run(
      {
        name: business.name,
        description: business.description,
      },
      this.db,
    );

    return res[0].business_id;
  }

  async remove(businessId: number): Promise<void> {
    const removeBusiness = sql<IRemoveBusinessQuery>`delete from business where business_id = $businessId`;

    await removeBusiness.run({ businessId }, this.db);
  }

  async getById(businessId: number): Promise<Business> {
    const getBusinessById = sql<IGetBusinessByIdQuery>`select
      business_id as "businessId", name, description
      from business
      where business_id = $businessId;`;

    const res = await getBusinessById.run({ businessId }, this.db);

    if (res.length === 0) {
      throw new BusinessNotFoundError(businessId);
    }

    return new Business({ ...res[0] });
  }

  async getReviews(businessId: number): Promise<Review[]> {
    const getReviewsForBusiness = sql<IGetReviewsForBusinessQuery>`select
      review_id as reviewId, business_id as "businessId", title, rating, description, created_at as "createdAt"
      from review where business_id = $businessId`;

    const res = await getReviewsForBusiness.run({ businessId }, this.db);

    return res;
  }

  async getRatings(businessId: number): Promise<Rating[]> {
    const getRatingsForBusiness = sql<IGetRatingsForBusinessQuery>`select rating from review where business_id = $businessId`;

    const res = await getRatingsForBusiness.run({ businessId }, this.db);

    return res.map(({ rating }) => rating);
  }
}
