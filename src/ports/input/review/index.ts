import type { GetReviewsForBusinessPort } from "@/ports/input/review/get-reviews-for-business.port";
import type { RemoveReviewPort } from "@/ports/input/review/remove-review.port";
import type { ReviewBusinessPort } from "@/ports/input/review/review-business.port";

export interface ReviewApiPort
	extends ReviewBusinessPort,
		GetReviewsForBusinessPort,
		RemoveReviewPort {}
