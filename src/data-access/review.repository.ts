import type { Review } from "@/domain/entities/review";
import { sql } from "@pgtyped/runtime";
import type { Pool } from "pg";
import type {
  ICreateReviewQuery,
  IRemoveReviewQuery,
} from "./types/review.repository.types";

export class ReviewRepository {
  db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(review: Review) {
    const createReview = sql<ICreateReviewQuery>`insert into review(business_id, rating, title, description)
      values ($businessId, $rating, $title, $description) returning review_id`;

    const res = await createReview.run({ ...review }, this.db);

    return res[0].reviewId;
  }

  async remove(reviewId: number) {
    const removeReview = sql<IRemoveReviewQuery>`delete from review where review_id = $reviewId`;

    await removeReview.run({ reviewId }, this.db);
  }
}
