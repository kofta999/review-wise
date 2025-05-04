import { TYPES } from "@/common/types";
import { Business } from "@/core/domain/entities/business";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import { sql } from "@pgtyped/runtime";
import { inject, injectable } from "inversify";
import type { IPostgresDataSource } from "../data-sources/postgres/postgres.data-source";
import type {
	ICreateBusinessQuery,
	IExistsQuery,
	IGetBusinessByIdQuery,
	IRemoveBusinessQuery,
} from "../data-sources/postgres/types/business.repository.types";

@injectable()
export class BusinessRepositoryAdapter implements BusinessRepositoryPort {
	db: IPostgresDataSource;

	constructor(@inject(TYPES.PostgresDataSource) db: IPostgresDataSource) {
		this.db = db;
	}

	async exists(businessId: number): Promise<boolean> {
		const exists = sql<IExistsQuery>`select 1 as "exists" from business where business_id = $businessId`;

		const res = await exists.run({ businessId }, this.db);

		return res.length !== 0;
	}

	async create(business: Business): Promise<number> {
		const createBusiness = sql<ICreateBusinessQuery>`insert into business(name, description, user_id)
      values ($name, $description, $userId) returning business_id`;

		const res = await createBusiness.run(
			{
				name: business.name,
				description: business.description,
				userId: business.userId,
			},
			this.db,
		);

		return res[0].business_id;
	}

	async remove(businessId: number): Promise<void> {
		const removeBusiness = sql<IRemoveBusinessQuery>`delete from business where business_id = $businessId`;

		await removeBusiness.run({ businessId }, this.db);
	}

	async getById(businessId: number): Promise<Business | null> {
		const getBusinessById = sql<IGetBusinessByIdQuery>`select
      business_id as "businessId", name, description, user_id as "userId"
      from business
      where business_id = $businessId;`;

		const res = await getBusinessById.run({ businessId }, this.db);

		if (res.length === 0) {
			return null;
		}

		return new Business({ ...res[0] });
	}
}
