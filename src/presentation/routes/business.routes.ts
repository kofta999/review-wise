import { RegisterBusinessSchema } from "@/common/dtos/create-business.dto";
import jsonContent from "@/common/util/json-content";
import { createRoute, z } from "@hono/zod-openapi";

export const register = createRoute({
  path: "/",
  method: "post",
  summary: "Register a business",
  request: {
    body: jsonContent(RegisterBusinessSchema, "The business to register"),
  },
  responses: {
    201: jsonContent(
      z.object({
        businessId: z.number(),
      }),
      "The registered business's ID",
    ),
  },
});
