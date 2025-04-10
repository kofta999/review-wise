import type { RegisterBusinessDTO } from "@/common/dtos/create-business.dto";
import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";

export interface IBusinessService {
  registerBusiness(dto: RegisterBusinessDTO): Promise<number>;
  getBusinessById(businessId: number): Promise<GetBusinessDTO>;
}
