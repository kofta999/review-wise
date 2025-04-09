export class Review {
  reviewId?: number | undefined;
  businessId: number;
  rating: number;
  title: string;
  description: string;
  createdAt?: Date | undefined;

  constructor({
    reviewId,
    businessId,
    description,
    rating,
    title,
  }: Pick<
    Review,
    "reviewId" | "businessId" | "description" | "rating" | "title"
  >) {
    this.reviewId = reviewId;
    this.businessId = businessId;
    this.description = description;
    this.rating = rating;
    this.title = title;
  }
}
