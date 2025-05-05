import { BaseError } from "./base-error";

export class ResourceAlreadyExists extends BaseError {
	constructor(type?: string) {
		super(`${type ?? "Resource"} Already exists`);
	}
}
