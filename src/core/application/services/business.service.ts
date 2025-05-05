import type { GetBusinessDTO } from "@/common/dtos/get-business.dto";
import { BusinessNotFoundError } from "@/common/errors/business-not-found";
import { TYPES } from "@/common/types";
import { Logger } from "@/common/util/logger";
import type { BusinessApiPort } from "@/ports/input/business";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";
import { inject, injectable } from "inversify";
import { Business } from "../../domain/entities/business";

@injectable()
export class BusinessService implements BusinessApiPort {
	private businessRepository: BusinessRepositoryPort;
	private reviewRepository: ReviewRepositoryPort;
	private logger = Logger.getLogger();

	constructor(
		@inject(TYPES.BusinessRepositoryPort)
		businessRepository: BusinessRepositoryPort,
		@inject(TYPES.ReviewRepositoryPort) reviewRepository: ReviewRepositoryPort,
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

		if (!business) {
			throw new BusinessNotFoundError(businessId);
		}

		this.logger.info(`Retrieved details for business with ID ${businessId}`);

		return {
			businessId,
			name: business.name,
			description: business.description,
			averageRating: business.calculateAverageRating(ratings),
		};
	}

	async removeBusiness(businessId: number): Promise<void> {
		await this.businessRepository.remove(businessId);
		this.logger.info(`Admin has deleted business with ID ${businessId}`);
	}
}
