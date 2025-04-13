import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import type { Business } from "@/domain/entities/business";

export interface IBusinessService {
  registerBusiness(
    newBusiness: Pick<Business, "name" | "description" | "userId">,
  ): Promise<number>;
  getBusinessById(businessId: number): Promise<GetBusinessDTO>;
}
