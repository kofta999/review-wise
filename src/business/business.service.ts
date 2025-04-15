import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import { Logger } from "@/common/util/logger";
import type { IBusinessRepository } from "@/data-access/interfaces/business.repository.interface";
import type { IReviewRepository } from "@/data-access/interfaces/review.repository.interface";
import { Business } from "@/domain/entities/business";
import type { IBusinessService } from "./interfaces/business.service.interface";

export class BusinessService implements IBusinessService {
  private businessRepository: IBusinessRepository;
  private reviewRepository: IReviewRepository;
  private logger = Logger.getLogger();

  constructor(
    businessRepository: IBusinessRepository,
    reviewRepository: IReviewRepository,
  ) {
    this.businessRepository = businessRepository;
    this.reviewRepository = reviewRepository;
  }

  async registerBusiness(
    newBusiness: Pick<Business, "name" | "description" | "userId">,
  ): Promise<number> {
    const business = new Business({ ...newBusiness });

    const res = await this.businessRepository.create(business);

    this.logger.info(`Business ${business.name} was registered with ID ${res}`);

    return res;
  }

  async getBusinessById(businessId: number): Promise<GetBusinessDTO> {
    const [business, ratings] = await Promise.all([
      this.businessRepository.getById(businessId),
      this.reviewRepository.getRatingsForBusiness(businessId),
    ]);

    this.logger.info(`Retrieved details for business with ID ${businessId}`);

    return {
      businessId,
      name: business.name,
      description: business.description,
      averageRating: business.calculateAverageRating(ratings),
    };
  }

  async adminRemoveBusiness(businessId: number): Promise<void> {
    await this.businessRepository.remove(businessId);
    this.logger.info(`Admin has deleted business with ID ${businessId}`);
  }
}
