import type { Business } from "@/core/domain/entities/business";

export interface RegisterBusinessPort {
	registerBusiness(
		newBusiness: Pick<Business, "name" | "description" | "userId">,
	): Promise<number>;
}
