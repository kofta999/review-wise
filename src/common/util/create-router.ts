import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings } from "@/common/types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false });
}
