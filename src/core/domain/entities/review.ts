export class Review<T extends undefined | never = undefined> {
  reviewId: number | T;
  businessId: number;
  rating: number;
  title: string;
  description: string;
  createdAt: Date | T;

  constructor(data: {
    reviewId?: number | T;
    businessId: number;
    description: string;
    rating: number;
    title: string;
    createdAt?: Date | T;
  }) {
    this.businessId = data.businessId;
    this.description = data.description;
    this.rating = data.rating;
    this.title = data.title;

    // Type assertion here since we know what we're doing
    this.reviewId = data.reviewId as number | T;
    this.createdAt = data.createdAt as Date | T;
  }
}
