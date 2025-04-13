/** Types generated for queries found in "src/data-access/review.repository.ts" */

/** 'Exists' parameters type */
export interface IExistsParams {
  businessId?: number | null | void;
}

/** 'Exists' return type */
export interface IExistsResult {
  exists: number | null;
}

/** 'Exists' query type */
export interface IExistsQuery {
  params: IExistsParams;
  result: IExistsResult;
}

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

/** 'GetReviewsForBusiness' parameters type */
export interface IGetReviewsForBusinessParams {
  businessId?: number | null | void;
}

/** 'GetReviewsForBusiness' return type */
export interface IGetReviewsForBusinessResult {
  businessId: number;
  createdAt: Date;
  description: string;
  rating: number;
  reviewid: number;
  title: string;
}

/** 'GetReviewsForBusiness' query type */
export interface IGetReviewsForBusinessQuery {
  params: IGetReviewsForBusinessParams;
  result: IGetReviewsForBusinessResult;
}

/** 'GetRatingsForBusiness' parameters type */
export interface IGetRatingsForBusinessParams {
  businessId?: number | null | void;
}

/** 'GetRatingsForBusiness' return type */
export interface IGetRatingsForBusinessResult {
  rating: number;
}

/** 'GetRatingsForBusiness' query type */
export interface IGetRatingsForBusinessQuery {
  params: IGetRatingsForBusinessParams;
  result: IGetRatingsForBusinessResult;
}

