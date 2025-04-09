import type { Review } from "./review";

export class Business {
  businessId?: number;
  name: string;
  description: string;

  constructor({ name, description }: Pick<Business, "name" | "description">) {
    this.name = name;
    this.description = description;
  }

  calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((prev, curr) => prev + curr.rating, 0);

    return sum / reviews.length;
  }

  generateSlug(): string {
    return this.name.replace(" ", "-");
  }

  exists(): boolean {
    return !!this.businessId;
  }
}
