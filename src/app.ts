import configureOpenAPI from "@/common/util/configure-open-api";
import { createRouter } from "@/common/util/create-router";
import { BusinessRepository } from "@/data-access/business.repository";
import { BusinessController } from "@/presentation/controllers/business.controller";
import * as businessRoutes from "@/presentation/routes/business.routes";
import { Pool } from "pg";
import { BusinessService } from "./business/business.service";
import type { AppOpenAPI } from "./common/types";

function injectDeps(app: AppOpenAPI) {
  const pool = new Pool({
    port: 5432,
    host: "localhost",
    user: "test",
    password: "test",
    database: "review_wise_db",
  });

  // Business
  const businessRepository = new BusinessRepository(pool);
  const businessService = new BusinessService(businessRepository);
  const businessController = new BusinessController(businessService);
  const businessRouter = createRouter()
    .openapi(businessRoutes.register, businessController.register)
    .openapi(businessRoutes.getById, businessController.getById)
    .openapi(businessRoutes.getReviews, businessController.getReviews);
  app.route("/business", businessRouter);
}

// Initializes all middlewares etc
function bootstrap() {
  const app = createRouter();

  configureOpenAPI(app);

  app.basePath("/api/v1");

  injectDeps(app);

  app.onError((err, c) => {
    console.log(err);
    return c.json("test");
  });

  return app;
}

export default bootstrap();
