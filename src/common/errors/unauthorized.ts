import { BaseApiError } from "./base-error";

export class UnauthorizedError extends BaseApiError {
  constructor() {
    super(401, "Unauthorized to perform this action");
  }
}
