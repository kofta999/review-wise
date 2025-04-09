import type { Rating } from "@/common/types";
import type { Review } from "./review";

export class Business {
  businessId?: number;
  name: string;
  description: string;

  constructor({
    businessId,
    name,
    description,
  }: Pick<Business, "businessId" | "name" | "description">) {
    this.businessId = businessId;
    this.name = name;
    this.description = description;
  }

  calculateAverageRating(ratings: Rating[]): Rating {
    if (!ratings || ratings.length === 0) return 0;

    const sum = ratings.reduce((prev, curr) => prev + curr, 0);

    return sum / ratings.length;
  }

  generateSlug(): string {
    return this.name.replace(" ", "-");
  }

  exists(): boolean {
    return !!this.businessId;
  }
}
