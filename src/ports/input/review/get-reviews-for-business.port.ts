import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";

export interface GetReviewsForBusinessPort {
	getReviewsForBusiness(
		businessId: number,
		options: {
			pagination: { limit: number; page: number };
			sorting: { asc: boolean; field: "rating" | "date" };
		},
	): Promise<GetBusinessReviewsDTO>;
}
