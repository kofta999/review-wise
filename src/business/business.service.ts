import type { RegisterBusinessDTO } from "@/common/dtos/create-business.dto";
import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import type { BusinessRepository } from "@/data-access/business.repository";
import { Business } from "@/domain/entities/business";

export class BusinessService {
  private repository: BusinessRepository;

  constructor(repository: BusinessRepository) {
    this.repository = repository;
  }

  async registerBusiness(dto: RegisterBusinessDTO): Promise<number> {
    const business = new Business({ ...dto });

    const res = await this.repository.create(business);

    return res;
  }

  async getBusinessById(businessId: number): Promise<GetBusinessDTO> {
    const business = await this.repository.getById(businessId);
    const ratings = await this.repository.getRatings(businessId);

    if (!business || !business.businessId) {
      throw new Error("");
    }

    return {
      businessId: business.businessId,
      name: business.name,
      description: business.description,
      averageRating: business.calculateAverageRating(ratings),
    };
  }
}
