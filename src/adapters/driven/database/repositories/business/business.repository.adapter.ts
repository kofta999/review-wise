import type { Business } from "@/core/domain/entities/business";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import { inject, injectable } from "inversify";
import { BusinessCacheRepository } from "./business.cache.repository";

@injectable()
export class BusinessRepositoryAdapter implements BusinessRepositoryPort {
	constructor(
		@inject(BusinessCacheRepository)
		private repository: BusinessCacheRepository,
	) {}

	async exists(businessId: number): Promise<boolean> {
		return this.repository.exists(businessId);
	}

	async create(business: Business): Promise<number> {
		return this.repository.create(business);
	}

	async remove(businessId: number): Promise<void> {
		return this.repository.remove(businessId);
	}

	async getById(businessId: number): Promise<Business | null> {
		return this.repository.getById(businessId);
	}
}
