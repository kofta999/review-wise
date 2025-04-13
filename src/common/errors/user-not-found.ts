import { BaseApiError } from "./base-error";

export class UserNotFoundError extends BaseApiError {
  constructor(identifier: number | string) {
    super(
      404,
      `User of ${typeof identifier === "number" ? `ID ${identifier}` : "Email [REDACTED]"} is not found`,
    );
  }
}
