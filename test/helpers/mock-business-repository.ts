import { type Mock, mock } from "bun:test";
import type { Business } from "@/core/domain/entities/business";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";

export interface MockBusinessRepository extends BusinessRepositoryPort {
	exists: Mock<(businessId: number) => Promise<boolean>>;
	create: Mock<(business: Business) => Promise<number>>;
	remove: Mock<(businessId: number) => Promise<void>>;
	getById: Mock<(businessId: number) => Promise<Business>>;
}

export function createMockBusinessRepository(): MockBusinessRepository {
	return {
		exists: mock<(businessId: number) => Promise<boolean>>(),
		create: mock<(business: Business) => Promise<number>>(),
		remove: mock<(businessId: number) => Promise<void>>(),
		getById: mock<(businessId: number) => Promise<Business>>(),
	};
}
