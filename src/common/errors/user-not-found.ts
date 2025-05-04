import { BaseError } from "./base-error";

export class UserNotFoundError extends BaseError {
	constructor(identifier?: number) {
		super(
			typeof identifier === "number"
				? `User of ID ${identifier} is not found`
				: "User not found",
		);
	}
}
