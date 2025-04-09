export class Review {
  reviewId?: number | undefined;
  businessId: number;
  rating: number;
  title: string;
  description: string;
  createdAt?: Date | undefined;

  constructor({
    businessId,
    description,
    rating,
    title,
  }: Pick<Review, "businessId" | "description" | "rating" | "title">) {
    this.businessId = businessId;
    this.description = description;
    this.rating = rating;
    this.title = title;
  }
}
