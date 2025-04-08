/** Types generated for queries found in "src/data-access/business.repository.ts" */

/** 'GetBusinessById' parameters type */
export interface IGetBusinessByIdParams {
  businessId?: number | null | void;
}

/** 'GetBusinessById' return type */
export interface IGetBusinessByIdResult {
  businessId: number;
  description: string | null;
  name: string | null;
}

/** 'GetBusinessById' query type */
export interface IGetBusinessByIdQuery {
  params: IGetBusinessByIdParams;
  result: IGetBusinessByIdResult;
}

