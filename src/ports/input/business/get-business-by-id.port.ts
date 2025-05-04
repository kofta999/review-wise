import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";

export interface GetBusinessByIdPort {
	getBusinessById(businessId: number): Promise<GetBusinessDTO>;
}
