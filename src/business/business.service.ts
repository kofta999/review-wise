import { RegisterBusinessDTO } from "@/common/dtos/create-business.dto";
import { BusinessRepository } from "@/data-access/business.repository";
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
}
