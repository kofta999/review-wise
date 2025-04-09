import { RegisterBusinessSchema } from "@/common/dtos/create-business.dto";
import { GetBusinessSchema } from "@/common/dtos/get-business.dto";
import jsonContent from "@/common/util/json-content";
import { createRoute, z } from "@hono/zod-openapi";

const tags = ["Business"];

export const register = createRoute({
  path: "/",
  method: "post",
  tags,
  summary: "Register",
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

export type RegisterRoute = typeof register;

export const getById = createRoute({
  path: "/{id}",
  method: "get",
  tags,
  summary: "Get by Id",
  request: {
    params: z.object({
      id: z.coerce.number().openapi({
        param: {
          name: "id",
          in: "path",
          required: true,
        },
        required: ["id"],
      }),
    }),
  },
  responses: {
    200: jsonContent(GetBusinessSchema, "The business's details"),
  },
});

export type GetByIdRoute = typeof getById;
