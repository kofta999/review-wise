import { BaseError } from "./base-error";

export class BusinessNotFoundError extends BaseError {
  constructor(businessId: number) {
    super();
    this.message = `Business of ID ${businessId} is not found`;
  }
}
