import type { PasswordPort } from "@/ports/output/security/password.port";
import * as Bun from "bun";
import { injectable } from "inversify";

@injectable()
export class BunPasswordAdapter implements PasswordPort {
	hashPassword(password: string): Promise<string> {
		return Bun.password.hash(password);
	}
	comparePassword(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return Bun.password.verify(plainPassword, hashedPassword);
	}
}
