import type { Business } from "@/domain/entities/business";

export interface IBusinessRepository {
  exists(businessId: number): Promise<boolean>;
  create(business: Business): Promise<number>;
  remove(businessId: number): Promise<void>;
  getById(businessId: number): Promise<Business>;
}
