import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { BusinessRepository } from "@/data-access/business.repository";
import { BusinessController } from "@/presentation/controllers/business.controller";
import * as adminRoutes from "@/presentation/routes/admin.routes";
import * as authRoutes from "@/presentation/routes/auth.routes";
import * as businessRoutes from "@/presentation/routes/business.routes";
import pg from "pg";
import { BcryptPasswordService } from "./business/bcrypt-password.service";
import { BusinessService } from "./business/business.service";
import { HonoJwtService } from "./business/hono-jwt.service";
import { ReviewService } from "./business/review.service";
import { UserService } from "./business/user.service";
import { BaseApiError } from "./common/errors/base-error";
import { errorHandler } from "./common/middleware/error-handler.middleware.";
import { loggerMiddleware } from "./common/middleware/pino-logger.middleware";
import { rateLimiterMiddleware } from "./common/middleware/rate-limiter.middleware";
import type { AppOpenAPI } from "./common/types";
import { ReviewRepository } from "./data-access/review.repository";
import { UserRepository } from "./data-access/user.repository";
import env from "./env";
import { AdminController } from "./presentation/controllers/admin.controller";
import { AuthController } from "./presentation/controllers/auth.controller";

function injectDeps(app: AppOpenAPI) {
  let config: pg.PoolConfig;

  if (process.env.DATABASE_URL) {
    config = {
      connectionString: process.env.DATABASE_URL,

      ssl: {
        rejectUnauthorized: false,
      },
    };
  } else {
    config = {
      port: env.PG_PORT,
      host: env.PG_HOST,
      user: env.PG_USER,
      password: env.PG_PASSWORD,
      database: env.PG_DB_NAME,
    };
  }

  const pool = new pg.Pool(config);

  // Repositories
  const businessRepository = new BusinessRepository(pool);
  const reviewRepository = new ReviewRepository(pool);
  const userRepository = new UserRepository(pool);

  // Services
  const passwordService = new BcryptPasswordService();
  const jwtService = new HonoJwtService(env.JWT_SECRET);
  const businessService = new BusinessService(
    businessRepository,
    reviewRepository,
  );
  const reviewService = new ReviewService(reviewRepository, businessRepository);
  const userService = new UserService(
    userRepository,
    passwordService,
    jwtService,
  );

  // Controllers
  const businessController = new BusinessController(
    businessService,
    reviewService,
    userService,
  );
  const authController = new AuthController(userService);
  const adminController = new AdminController(businessService, reviewService);

  // Routers
  const businessRouter = createRouter()
    .openapi(businessRoutes.register, businessController.register)
    .openapi(businessRoutes.getById, businessController.getById)
    .openapi(businessRoutes.getReviews, businessController.getReviews)
    .openapi(businessRoutes.submitReview, businessController.submitReview);

  const authRouter = createRouter().openapi(
    authRoutes.login,
    authController.login,
  );

  const adminRouter = createRouter()
    .openapi(adminRoutes.deleteBusiness, adminController.deleteBusiness)
    .openapi(adminRoutes.deleteReview, adminController.deleteReview);

  app
    .route("/api/v1/businesses", businessRouter)
    .route("/api/v1/auth", authRouter)
    .route("/api/v1/admin", adminRouter);
}

// Initializes all middlewares etc
function bootstrap() {
  const app = createRouter();
  app.use(loggerMiddleware());
  app.use(rateLimiterMiddleware(50));

  configureOpenAPI(app);

  injectDeps(app);

  app.onError(errorHandler);

  // Go to docs on /
  app.get("/", (c) => c.redirect("/reference"));

  return app;
}

export default bootstrap();
