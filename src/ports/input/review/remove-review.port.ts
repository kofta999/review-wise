export interface RemoveReviewPort {
	removeReview(reviewId: number): Promise<void>;
}
