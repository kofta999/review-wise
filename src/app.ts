import { createRouter } from "@/common/util/create-router";
import configureOpenAPI from "./common/util/configure-open-api";
import { BusinessController } from "./presentation/controllers/business.controller";

// Initializes all middlewares etc
function bootstrap() {
  const app = createRouter();

  configureOpenAPI(app);

  app.route("/business", BusinessController);

  app.onError((err, c) => {
    console.log(err);
    return c.json("test");
  });

  return app;
}

export default bootstrap();
