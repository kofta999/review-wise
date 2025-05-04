import { type Mock, mock } from "bun:test";
import type { JwtPort } from "@/ports/output/security/jwt.port";

export interface MockJwtService extends JwtPort {
	sign: Mock<(payload: unknown) => Promise<string>>;
	verify: Mock<(token: string) => Promise<unknown>>;
}

export function createMockJwtService(): MockJwtService {
	return {
		sign: mock<(payload: unknown) => Promise<string>>(),
		verify: mock<(token: string) => Promise<unknown>>(),
	};
}
