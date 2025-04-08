/** Types generated for queries found in "src/data-access/business.repository.ts" */

/** 'CreateBusiness' parameters type */
export interface ICreateBusinessParams {
  description?: string | null | void;
  name?: string | null | void;
}

/** 'CreateBusiness' return type */
export interface ICreateBusinessResult {
  businessId: number;
}

/** 'CreateBusiness' query type */
export interface ICreateBusinessQuery {
  params: ICreateBusinessParams;
  result: ICreateBusinessResult;
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

