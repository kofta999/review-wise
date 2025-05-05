import { BaseError } from "./base-error";

export class InvalidCredentialsError extends BaseError {
	constructor() {
		super("Invalid credentials, double check your email or password");
	}
}
