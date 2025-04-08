export class Business {
  businessId?: number;
  name: string;
  description: string;

  constructor({ name, description }: { name: string; description: string }) {
    this.name = name;
    this.description = description;
  }

  calculateAverageRating(): number {
    return 3;
  }

  generateSlug(): string {
    return this.name.replace(" ", "-");
  }

  exists(): boolean {
    return !!this.businessId;
  }
}
