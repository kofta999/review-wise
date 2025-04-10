import type { RegisterBusinessDTO } from "@/common/dtos/create-business.dto";
import type { GetBusinessReviewsDTO } from "@/common/dtos/get-business-reviews.dto";
import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import { Logger } from "@/common/util/logger";
import type { BusinessRepository } from "@/data-access/business.repository";
import { Business } from "@/domain/entities/business";

export class BusinessService {
  private repository: BusinessRepository;
  private logger = Logger.getLogger();

  constructor(repository: BusinessRepository) {
    this.repository = repository;
  }

  async registerBusiness(dto: RegisterBusinessDTO): Promise<number> {
    const business = new Business({ ...dto });

    const res = await this.repository.create(business);

    this.logger.info(`Business ${business.name} was registered with ID ${res}`);

    return res;
  }

  async getBusinessById(businessId: number): Promise<GetBusinessDTO> {
    const [business, ratings] = await Promise.all([
      this.repository.getById(businessId),
      this.repository.getRatings(businessId),
    ]);

    this.logger.info(`Retrieved details for business with ID ${businessId}`);

    return {
      businessId,
      name: business.name,
      description: business.description,
      averageRating: business.calculateAverageRating(ratings),
    };
  }

  async getBusinessReviews(businessId: number): Promise<GetBusinessReviewsDTO> {
    const reviews = await this.repository.getReviews(businessId);

    this.logger.info(`Retrieved reviews for business with ID ${businessId}`);

    return reviews;
  }
}
