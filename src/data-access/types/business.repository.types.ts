/** Types generated for queries found in "src/data-access/business.repository.ts" */

/** 'CreateBusiness' parameters type */
export interface ICreateBusinessParams {
  description?: string | null | void;
  name?: string | null | void;
  userId?: number | null | void;
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
  userId: number;
}

/** 'GetBusinessById' query type */
export interface IGetBusinessByIdQuery {
  params: IGetBusinessByIdParams;
  result: IGetBusinessByIdResult;
}

