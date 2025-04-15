import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import type { Rating } from "@/common/types";
import { Review } from "@/domain/entities/review";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type { IReviewRepository } from "./interfaces/review.repository.interface";
import type {
  ICreateReviewQuery,
  IGetCountForBusinessQuery,
  IGetRatingsForBusinessQuery,
  IGetReviewsForBusinessQuery,
  IRemoveReviewQuery,
} from "./types/review.repository.types";

export class ReviewRepository implements IReviewRepository {
  db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
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

  async getReviewsForBusiness(
    businessId: number,
    { limit, offset }: { limit: number; offset: number },
    { asc, field }: { asc: boolean; field: string },
  ): Promise<Review<never>[]> {
    const getReviewsForBusiness = sql<IGetReviewsForBusinessQuery>`select
      review_id as "reviewId", business_id as "businessId", title, rating, description, created_at as "createdAt"
      from review
      where business_id = $businessId
      order by (case when $field = 'rating' and $asc = true then rating end) asc,
               (case when $field = 'rating' and $asc = false then rating end) desc,
               (case when $field = 'date' and $asc = true then created_at end) asc,
               (case when $field = 'date' and $asc = false then created_at end) desc
      limit $limit
      offset $offset
      `;

    const res = await getReviewsForBusiness.run(
      { businessId, limit, offset, asc, field },
      this.db,
    );

    return res.map((rev) => new Review<never>(rev));
  }

  async getRatingsForBusiness(businessId: number): Promise<Rating[]> {
    const getRatingsForBusiness = sql<IGetRatingsForBusinessQuery>`select rating from review where business_id = $businessId`;

    const res = await getRatingsForBusiness.run({ businessId }, this.db);

    return res.map(({ rating }) => rating);
  }

  async getReviewCount(businessId: number): Promise<number> {
    // Probably no need to check existence
    const getCountForBusiness = sql<IGetCountForBusinessQuery>`select count(1) as count from review where business_id = $businessId`;

    const res = await getCountForBusiness.run({ businessId }, this.db);

    if (!res[0].count) {
      throw new Error("Should never happen");
    }

    return Number.parseInt(res[0].count);
  }
}
