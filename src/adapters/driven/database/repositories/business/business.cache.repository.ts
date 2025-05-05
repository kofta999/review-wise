import { TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import { Business } from "@/core/domain/entities/business";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import { inject } from "inversify";
import { BusinessDatabaseRepository } from "./business.database.repository";

export class BusinessCacheRepository implements BusinessRepositoryPort {
	private readonly CACHE_KEY = "business";
	private readonly logger = Logger.getLogger();

	constructor(
		@inject(BusinessDatabaseRepository)
		private businessRepository: BusinessDatabaseRepository,
		@inject(TYPES.CachePort) private cache: CachePort,
	) {}

	exists(businessId: number): Promise<boolean> {
		return this.businessRepository.exists(businessId);
	}

	create(business: Business): Promise<number> {
		return this.businessRepository.create(business);
	}

	remove(businessId: number): Promise<void> {
		return this.businessRepository.remove(businessId);
	}

	async getById(businessId: number): Promise<Business | null> {
		const key = this.generateKey(businessId);
		const cached = await this.cache.get<Business>(key);

		if (cached) {
			// What returns from cache is a normal object not an entity
			this.logger.info(`Fetched business with ID ${businessId} from cache`);
			return cached ? new Business({ ...cached }) : null;
		}

		const business = await this.businessRepository.getById(businessId);

		this.cache.set(key, business);
		this.logger.info(`Added business with ID ${businessId} to cache`);

		return business;
	}

	private generateKey(...args: (string | number)[]): string {
		return [this.CACHE_KEY, ...args].join(":");
	}
}
