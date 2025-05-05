import type { PasswordPort } from "@/ports/output/security/password.port";
import bcrypt from "bcryptjs";
import { injectable } from "inversify";

@injectable()
export class BcryptPasswordAdapter implements PasswordPort {
	private SALT_ROUNDS = 10 as const;

	hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, this.SALT_ROUNDS);
	}
	comparePassword(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}
