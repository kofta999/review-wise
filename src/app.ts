import { createRouter } from "@/common/util/create-router";
import configureOpenAPI from "./common/util/configure-open-api";

// Initializes all middlewares etc
function bootstrap() {
  const app = createRouter();

  configureOpenAPI(app);

  return app;
}

export default bootstrap();
