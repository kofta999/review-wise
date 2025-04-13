import { type Mock, mock } from "bun:test";
import type { IJwtService } from "@/business/interfaces/jwt.service.interface";

export interface MockJwtService extends IJwtService {
  sign: Mock<(payload: unknown) => Promise<string>>;
  verify: Mock<(token: string) => Promise<unknown>>;
}

export function createMockJwtService(): MockJwtService {
  return {
    sign: mock<(payload: unknown) => Promise<string>>(),
    verify: mock<(token: string) => Promise<unknown>>(),
  };
}
