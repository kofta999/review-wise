import { BaseApiError } from "./base-error";

export class BusinessNotFoundError extends BaseApiError {
  constructor(businessId: number) {
    super(404);
    this.message = `Business of ID ${businessId} is not found`;
  }
}
