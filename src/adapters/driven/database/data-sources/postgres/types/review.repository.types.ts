/** Types generated for queries found in "src/data-access/review.repository.ts" */
export type NumberOrString = number | string;

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
  asc?: boolean | null | void;
  businessId?: number | null | void;
  field?: string | null | void;
  limit?: NumberOrString | null | void;
  offset?: NumberOrString | null | void;
}

/** 'GetReviewsForBusiness' return type */
export interface IGetReviewsForBusinessResult {
  businessId: number;
  createdAt: Date;
  description: string;
  rating: number;
  reviewId: number;
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

/** 'GetCountForBusiness' parameters type */
export interface IGetCountForBusinessParams {
  businessId?: number | null | void;
}

/** 'GetCountForBusiness' return type */
export interface IGetCountForBusinessResult {
  count: string | null;
}

/** 'GetCountForBusiness' query type */
export interface IGetCountForBusinessQuery {
  params: IGetCountForBusinessParams;
  result: IGetCountForBusinessResult;
}

