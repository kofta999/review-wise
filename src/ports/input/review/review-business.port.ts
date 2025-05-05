import type { ReviewBusinessDTO } from "@/common/dtos/review-business.dto";

export interface ReviewBusinessPort {
	reviewBusiness(dto: ReviewBusinessDTO): Promise<number>;
}
