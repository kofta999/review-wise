import { sql } from "@pgtyped/runtime";
import {
  ICreateBusinessQuery,
  IGetBusinessByIdQuery,
  IGetReviewsForBusinessQuery,
  IRemoveBusinessQuery,
} from "./types/business.repository.types";
import { Pool } from "pg";
import { Business } from "@/domain/entities/business";

export class BusinessRepository {
  db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async create(business: Business) {
    const createBusiness = sql<ICreateBusinessQuery>`insert into business(name, description) values ($name, $description) returning business_id`;

    const res = await createBusiness.run(
      {
        name: business.name,
        description: business.description,
      },
      this.db,
    );

    return res[0].businessId;
  }

  async remove(businessId: number) {
    const removeBusiness = sql<IRemoveBusinessQuery>`delete from business where business_id = $businessId`;

    await removeBusiness.run({ businessId }, this.db);
  }

  async getById(businessId: number) {
    const getBusinessById = sql<IGetBusinessByIdQuery>`select * from business where business_id = $businessId;`;

    const res = await getBusinessById.run({ businessId }, this.db);

    return new Business({ ...res[0] });
  }

  async getReviews(businessId: number) {
    const getReviewsForBusiness = sql<IGetReviewsForBusinessQuery>`select * from review where business_id = $businessId`;

    const res = await getReviewsForBusiness.run({ businessId }, this.db);

    return res;
  }
}
