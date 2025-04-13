import { type Mock, mock } from "bun:test";
import type { IPasswordService } from "@/business/interfaces/password.service.interface";

export interface MockPasswordService extends IPasswordService {
  hashPassword: Mock<(password: string) => Promise<string>>;
  comparePassword: Mock<
    (plainPassword: string, hashedPassword: string) => Promise<boolean>
  >;
}

export function createMockPasswordService(): MockPasswordService {
  return {
    hashPassword: mock<(password: string) => Promise<string>>(),
    comparePassword: mock<
      (plainPassword: string, hashedPassword: string) => Promise<boolean>
    >(),
  };
}