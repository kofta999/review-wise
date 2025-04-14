import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import { Business } from "@/domain/entities/business";
import { type IDatabaseConnection, sql } from "@pgtyped/runtime";
import type { IBusinessRepository } from "./interfaces/business.repository.interface";
import type {
  ICreateBusinessQuery,
  IExistsQuery,
  IGetBusinessByIdQuery,
  IRemoveBusinessQuery,
} from "./types/business.repository.types";

export class BusinessRepository implements IBusinessRepository {
  db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
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

  async getById(businessId: number): Promise<Business> {
    const getBusinessById = sql<IGetBusinessByIdQuery>`select
      business_id as "businessId", name, description, user_id as "userId"
      from business
      where business_id = $businessId;`;

    const res = await getBusinessById.run({ businessId }, this.db);

    if (res.length === 0) {
      throw new BusinessNotFoundError(businessId);
    }

    return new Business({ ...res[0] });
  }
}
