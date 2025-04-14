import { type Mock, mock } from "bun:test";
import type { IBusinessRepository } from "@/data-access/interfaces/business.repository.interface";
import type { Business } from "@/domain/entities/business";

export interface MockBusinessRepository extends IBusinessRepository {
  create: Mock<(business: Business) => Promise<number>>;
  remove: Mock<(businessId: number) => Promise<void>>;
  getById: Mock<(businessId: number) => Promise<Business>>;
}

export function createMockBusinessRepository(): MockBusinessRepository {
  return {
    create: mock<(business: Business) => Promise<number>>(),
    remove: mock<(businessId: number) => Promise<void>>(),
    getById: mock<(businessId: number) => Promise<Business>>(),
  };
}
