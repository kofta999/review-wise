import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { BusinessController } from "@/presentation/controllers/business.controller";
import * as adminRoutes from "@/presentation/routes/admin.routes";
import * as authRoutes from "@/presentation/routes/auth.routes";
import * as businessRoutes from "@/presentation/routes/business.routes";
import { mainContainer } from "./common/ioc";
import { errorHandler } from "./common/middleware/error-handler.middleware.";
import { loggerMiddleware } from "./common/middleware/pino-logger.middleware";
import { rateLimiterMiddleware } from "./common/middleware/rate-limiter.middleware";
import type { AppOpenAPI } from "./common/types";
import { AdminController } from "./presentation/controllers/admin.controller";
import { AuthController } from "./presentation/controllers/auth.controller";

function initializeRouters(app: AppOpenAPI) {
  // Controllers
  const businessController = mainContainer.get(BusinessController);
  const authController = mainContainer.get(AuthController);
  const adminController = mainContainer.get(AdminController);

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

  initializeRouters(app);

  app.onError(errorHandler);

  // Go to docs on /
  app.get("/", (c) => c.redirect("/reference"));

  return app;
}

export default bootstrap();
