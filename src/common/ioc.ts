import { RedisCacheAdapter } from "@/adapters/driven/cache/redis-cache.adapter";
import { PostgresDataSource } from "@/adapters/driven/database/data-sources/postgres/postgres.data-source";
import { BusinessRepositoryAdapter } from "@/adapters/driven/database/repositories/business.repository.adapter";
import { ReviewRepositoryAdapter } from "@/adapters/driven/database/repositories/review.repository.adapter";
import { UserRepositoryAdapter } from "@/adapters/driven/database/repositories/user.repository.adapter";
import { BcryptPasswordAdapter } from "@/adapters/driven/security/bcrypt-password.adapter";
import { HonoJwtAdapter } from "@/adapters/driven/security/hono-jwt.adapter";
import { BusinessService } from "@/core/application/services/business.service";
import { ReviewService } from "@/core/application/services/review.service";
import { UserService } from "@/core/application/services/user.service";
import env from "@/env";
import type { BusinessApiPort } from "@/ports/input/business";
import type { ReviewApiPort } from "@/ports/input/review";
import type { UserApiPort } from "@/ports/input/user";
import type { CachePort } from "@/ports/output/cache/cache.port";
import type { BusinessRepositoryPort } from "@/ports/output/repositories/business.repository.port";
import type { ReviewRepositoryPort } from "@/ports/output/repositories/review.repository.port";
import type { UserRepositoryPort } from "@/ports/output/repositories/user.repository.port";
import type { JwtPort } from "@/ports/output/security/jwt.port";
import type { PasswordPort } from "@/ports/output/security/password.port";
import { Container } from "inversify";
import { TYPES } from "./types";

const mainContainer = new Container({ autobind: true });

// Database connection
mainContainer
	.bind<PostgresDataSource>(TYPES.PostgresDataSource)
	.to(PostgresDataSource)
	.inSingletonScope();

// Repositories
mainContainer
	.bind<BusinessRepositoryPort>(TYPES.BusinessRepositoryPort)
	.to(BusinessRepositoryAdapter);

mainContainer
	.bind<ReviewRepositoryPort>(TYPES.ReviewRepositoryPort)
	.to(ReviewRepositoryAdapter);

mainContainer
	.bind<UserRepositoryPort>(TYPES.UserRepositoryPort)
	.to(UserRepositoryAdapter);

// Services
mainContainer.bind<BusinessApiPort>(TYPES.BusinessApiPort).to(BusinessService);

mainContainer.bind<ReviewApiPort>(TYPES.ReviewApiPort).to(ReviewService);

mainContainer.bind<UserApiPort>(TYPES.UserApiPort).to(UserService);

// Common services
mainContainer
	.bind<CachePort>(TYPES.CachePort)
	.to(RedisCacheAdapter)
	.inSingletonScope();

mainContainer
	.bind<JwtPort>(TYPES.JwtPort)
	.to(HonoJwtAdapter)
	.inSingletonScope();

mainContainer
	.bind<PasswordPort>(TYPES.PasswordPort)
	.to(BcryptPasswordAdapter)
	.inSingletonScope();

// Constants
mainContainer.bind(TYPES.JWT_SECRET).toConstantValue(env.JWT_SECRET);

export { mainContainer };
