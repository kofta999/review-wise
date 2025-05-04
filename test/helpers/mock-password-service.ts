import { type Mock, mock } from "bun:test";
import type { PasswordPort } from "@/ports/output/security/password.port";

export interface MockPasswordService extends PasswordPort {
	hashPassword: Mock<(password: string) => Promise<string>>;
	comparePassword: Mock<
		(plainPassword: string, hashedPassword: string) => Promise<boolean>
	>;
}

export function createMockPasswordService(): MockPasswordService {
	return {
		hashPassword: mock<(password: string) => Promise<string>>(),
		comparePassword:
			mock<
				(plainPassword: string, hashedPassword: string) => Promise<boolean>
			>(),
	};
}
