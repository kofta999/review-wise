import * as adminRoutes from "@/adapters/driving/web/routes/admin.routes";
import * as authRoutes from "@/adapters/driving/web/routes/auth.routes";
import * as businessRoutes from "@/adapters/driving/web/routes/business.routes";
import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { AdminController } from "./adapters/driving/web/controllers/admin.controller";
import { AuthController } from "./adapters/driving/web/controllers/auth.controller";
import { BusinessController } from "./adapters/driving/web/controllers/business.controller";
import { errorHandler } from "./adapters/driving/web/middleware/error-handler.middleware";
import { loggerMiddleware } from "./adapters/driving/web/middleware/pino-logger.middleware";
import { rateLimiterMiddleware } from "./adapters/driving/web/middleware/rate-limiter.middleware";
import { mainContainer } from "./common/ioc";
import type { AppOpenAPI } from "./common/types";

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
