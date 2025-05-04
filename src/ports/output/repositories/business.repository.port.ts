import type { Business } from "@/core/domain/entities/business";

export interface BusinessRepositoryPort {
	exists(businessId: number): Promise<boolean>;
	create(business: Business): Promise<number>;
	remove(businessId: number): Promise<void>;
	getById(businessId: number): Promise<Business | null>;
}
