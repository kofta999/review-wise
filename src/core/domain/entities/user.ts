type UserRole = "BUSINESS" | "REVIEWER" | "ADMIN";

export class User {
	userId?: number;
	email: string;
	// Must be hashed
	password: string;
	role: UserRole;
	createdAt?: Date;

	constructor({
		userId,
		email,
		password,
		role,
		createdAt,
	}: Pick<User, "userId" | "email" | "password" | "createdAt" | "role">) {
		this.userId = userId;
		this.email = email;
		this.password = password;
		this.createdAt = createdAt;
		this.role = role;
	}
}
