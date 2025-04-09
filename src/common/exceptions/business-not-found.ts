export class BusinessNotFoundError extends Error {
  constructor(businessId: number) {
    super();
    this.message = `Business of ID ${businessId} is not found`;
  }
}
