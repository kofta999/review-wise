import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { BusinessRepository } from "@/data-access/business.repository";
import { BusinessController } from "@/presentation/controllers/business.controller";
import * as businessRoutes from "@/presentation/routes/business.routes";
import { Pool } from "pg";
import { BusinessService } from "./business/business.service";
import { ReviewService } from "./business/review.service";
import { errorHandler } from "./common/middleware/error-handler";
import { loggerMiddleware } from "./common/middleware/pino-logger";
import type { AppOpenAPI } from "./common/types";
import { ReviewRepository } from "./data-access/review.repository";

function injectDeps(app: AppOpenAPI) {
  const pool = new Pool({
    port: 5432,
    host: "localhost",
    user: "test",
    password: "test",
    database: "review_wise_db",
  });

  // Repositories
  const businessRepository = new BusinessRepository(pool);
  const reviewRepository = new ReviewRepository(pool);

  // Services
  const businessService = new BusinessService(
    businessRepository,
    reviewRepository,
  );
  const reviewService = new ReviewService(reviewRepository);

  // Controllers
  const businessController = new BusinessController(
    businessService,
    reviewService,
  );

  // Routers
  const businessRouter = createRouter()
    .openapi(businessRoutes.register, businessController.register)
    .openapi(businessRoutes.getById, businessController.getById)
    .openapi(businessRoutes.getReviews, businessController.getReviews)
    .openapi(businessRoutes.submitReview, businessController.submitReview);
  app.route("/businesses", businessRouter);
}

// Initializes all middlewares etc
function bootstrap() {
  const app = createRouter();
  app.use(loggerMiddleware());

  configureOpenAPI(app);

  app.basePath("/api/v1");

  injectDeps(app);

  app.onError(errorHandler);

  return app;
}

export default bootstrap();
