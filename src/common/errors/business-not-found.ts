import { BaseApiError } from "./base-error";

export class BusinessNotFoundError extends BaseApiError {
  constructor(businessId: number) {
    super(404, `Business of ID ${businessId} is not found`);
  }
}
