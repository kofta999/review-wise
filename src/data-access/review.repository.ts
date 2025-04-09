import type { Review } from "@/domain/entities/review";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type {
  ICreateReviewQuery,
  IRemoveReviewQuery,
} from "./types/review.repository.types";

export class ReviewRepository {
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
}
