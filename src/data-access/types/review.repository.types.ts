/** Types generated for queries found in "src/data-access/review.repository.ts" */

/** 'CreateReview' parameters type */
export interface ICreateReviewParams {
  businessId?: number | null | void;
  description?: string | null | void;
  rating?: number | null | void;
  title?: string | null | void;
}

/** 'CreateReview' return type */
export interface ICreateReviewResult {
  review_id: number;
}

/** 'CreateReview' query type */
export interface ICreateReviewQuery {
  params: ICreateReviewParams;
  result: ICreateReviewResult;
}

/** 'RemoveReview' parameters type */
export interface IRemoveReviewParams {
  reviewId?: number | null | void;
}

/** 'RemoveReview' return type */
export type IRemoveReviewResult = void;

/** 'RemoveReview' query type */
export interface IRemoveReviewQuery {
  params: IRemoveReviewParams;
  result: IRemoveReviewResult;
}

