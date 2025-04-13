import { BaseApiError } from "./base-error";

export class InvalidCredentialsError extends BaseApiError {
  constructor() {
    super(401, "Invalid credentials, double check your email or password");
  }
}
