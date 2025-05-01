import env from "@/env";
import type { IDatabaseConnection } from "@pgtyped/runtime";
import { Container } from "inversify";
import { BcryptPasswordService } from "../business/bcrypt-password.service";
import { BusinessService } from "../business/business.service";
import { DatabaseService } from "../business/database.service";
import { HonoJwtService } from "../business/hono-jwt.service";
import type { IBusinessService } from "../business/interfaces/business.service.interface";
import type { ICacheService } from "../business/interfaces/cache.service.interface";
import type { IJwtService } from "../business/interfaces/jwt.service.interface";
import type { IPasswordService } from "../business/interfaces/password.service.interface";
import type { IReviewService } from "../business/interfaces/review.service.interface";
import type { IUserService } from "../business/interfaces/user.service.interface";
import { RedisCacheService } from "../business/redis-cache.service";
import { ReviewService } from "../business/review.service";
import { UserService } from "../business/user.service";
import { BusinessRepository } from "../data-access/business.repository";
import type { IBusinessRepository } from "../data-access/interfaces/business.repository.interface";
import type { IReviewRepository } from "../data-access/interfaces/review.repository.interface";
import type { IUserRepository } from "../data-access/interfaces/user.repository.interface";
import { ReviewRepository } from "../data-access/review.repository";
import { UserRepository } from "../data-access/user.repository";
import { TYPES } from "./types";

const mainContainer = new Container({ autobind: true });

// Database connection
mainContainer
  .bind<IDatabaseConnection>(TYPES.IDatabaseConnection)
  .to(DatabaseService)
  .inSingletonScope();

// Repositories
mainContainer
  .bind<IBusinessRepository>(TYPES.IBusinessRepository)
  .to(BusinessRepository);

mainContainer
  .bind<IReviewRepository>(TYPES.IReviewRepository)
  .to(ReviewRepository);

mainContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

// Services
mainContainer
  .bind<IBusinessService>(TYPES.IBusinessService)
  .to(BusinessService);

mainContainer.bind<IReviewService>(TYPES.IReviewService).to(ReviewService);

mainContainer.bind<IUserService>(TYPES.IUserService).to(UserService);

// Common services
mainContainer
  .bind<ICacheService>(TYPES.ICacheService)
  .to(RedisCacheService)
  .inSingletonScope();

mainContainer
  .bind<IJwtService>(TYPES.IJwtService)
  .to(HonoJwtService)
  .inSingletonScope();

mainContainer
  .bind<IPasswordService>(TYPES.IPasswordService)
  .to(BcryptPasswordService)
  .inSingletonScope();

// Constants
mainContainer.bind(TYPES.JWT_SECRET).toConstantValue(env.JWT_SECRET);

export { mainContainer };
