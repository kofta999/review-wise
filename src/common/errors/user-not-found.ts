import { BaseApiError } from "./base-error";

export class UserNotFoundError extends BaseApiError {
  constructor(identifier?: number) {
    super(
      404,
      typeof identifier === "number"
        ? `User of ID ${identifier} is not found`
        : "User not found",
    );
  }
}
