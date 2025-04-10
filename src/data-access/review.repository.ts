import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import type { Rating } from "@/common/types";
import type { Review } from "@/domain/entities/review";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type { IReviewRepository } from "./interfaces/review.repository.interface";
import type {
  IExistsQuery,
  IGetRatingsForBusinessQuery,
  IGetReviewsForBusinessQuery,
} from "./types/business.repository.types";
import type {
  ICreateReviewQuery,
  IRemoveReviewQuery,
} from "./types/review.repository.types";

export class ReviewRepository implements IReviewRepository {
  db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
  }

  // TODO: Revisit this duplication later
  private async exists(businessId: number): Promise<boolean> {
    const exists = sql<IExistsQuery>`select 1 as "exists" from business where business_id = $businessId`;

    const res = await exists.run({ businessId }, this.db);

    return res.length !== 0;
  }

  async create(review: Review) {
    const createReview = sql<ICreateReviewQuery>`insert into review(business_id, rating, title, description)
      values ($businessId, $rating, $title, $description) returning review_id`;

    const res = await createReview.run({ ...review }, this.db);

    return res[0].review_id;
  }

  async remove(reviewId: number) {
    const removeReview = sql<IRemoveReviewQuery>`delete from review where review_id = $reviewId`;

    await removeReview.run({ reviewId }, this.db);
  }

  async getReviewsForBusiness(businessId: number): Promise<Review[]> {
    if (!(await this.exists(businessId))) {
      throw new BusinessNotFoundError(businessId);
    }

    const getReviewsForBusiness = sql<IGetReviewsForBusinessQuery>`select
      review_id as reviewId, business_id as "businessId", title, rating, description, created_at as "createdAt"
      from review where business_id = $businessId`;

    const res = await getReviewsForBusiness.run({ businessId }, this.db);

    return res;
  }

  async getRatingsForBusiness(businessId: number): Promise<Rating[]> {
    if (!(await this.exists(businessId))) {
      throw new BusinessNotFoundError(businessId);
    }

    const getRatingsForBusiness = sql<IGetRatingsForBusinessQuery>`select rating from review where business_id = $businessId`;

    const res = await getRatingsForBusiness.run({ businessId }, this.db);

    return res.map(({ rating }) => rating);
  }
}
