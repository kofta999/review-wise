import { BaseError } from "./base-error";

export class UnauthorizedError extends BaseError {
	constructor() {
		super("Unauthorized to perform this action");
	}
}
