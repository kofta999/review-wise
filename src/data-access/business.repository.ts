import { sql } from "@pgtyped/runtime";
import { IGetBusinessByIdQuery } from "./types/business.repository.types";

export class BusinessRepository {
  save() {
    const getBusinessById = sql`select * from business where business_id = $businessId;`;
  }
}
