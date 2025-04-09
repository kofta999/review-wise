/** Types generated for queries found in "src/data-access/business.repository.ts" */

/** 'CreateBusiness' parameters type */
export interface ICreateBusinessParams {
  description?: string | null | void;
  name?: string | null | void;
}

/** 'CreateBusiness' return type */
export interface ICreateBusinessResult {
  business_id: number;
}

/** 'CreateBusiness' query type */
export interface ICreateBusinessQuery {
  params: ICreateBusinessParams;
  result: ICreateBusinessResult;
}

/** 'RemoveBusiness' parameters type */
export interface IRemoveBusinessParams {
  businessId?: number | null | void;
}

/** 'RemoveBusiness' return type */
export type IRemoveBusinessResult = void;

/** 'RemoveBusiness' query type */
export interface IRemoveBusinessQuery {
  params: IRemoveBusinessParams;
  result: IRemoveBusinessResult;
}

/** 'GetBusinessById' parameters type */
export interface IGetBusinessByIdParams {
  businessId?: number | null | void;
}

/** 'GetBusinessById' return type */
export interface IGetBusinessByIdResult {
  businessId: number;
  description: string;
  name: string;
}

/** 'GetBusinessById' query type */
export interface IGetBusinessByIdQuery {
  params: IGetBusinessByIdParams;
  result: IGetBusinessByIdResult;
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

