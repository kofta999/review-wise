import { BaseError } from "./base-error";

export class BusinessNotFoundError extends BaseError {
	constructor(businessId: number) {
		super(`Business of ID ${businessId} is not found`);
	}
}
