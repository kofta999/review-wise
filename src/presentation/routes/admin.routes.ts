import { authMiddleware } from "@/common/middleware/auth.middleware";
import { requireRole } from "@/common/middleware/require-role.middleware";
import { IdSchema } from "@/common/schemas/id-schema";
import { createRoute } from "@hono/zod-openapi";

const tags = ["Admin"];

export const deleteBusiness = createRoute({
  path: "/business/{id}",
  method: "delete",
  tags,
  security: [{ bearerAuth: [] }],
  middleware: [authMiddleware, requireRole("ADMIN")] as const,
  summary: "Delete Business",
  request: {
    params: IdSchema,
  },
  responses: {
    204: { description: "Indicates the business is deleted" },
  },
});

export type DeleteBusinessRoute = typeof deleteBusiness;

export const deleteReview = createRoute({
  path: "/review/{id}",
  method: "delete",
  tags,
  middleware: [authMiddleware, requireRole("ADMIN")] as const,
  security: [{ bearerAuth: [] }],
  summary: "Delete Review",
  request: {
    params: IdSchema,
  },
  responses: {
    204: { description: "Indicates the review is deleted" },
  },
});

export type DeleteReviewRoute = typeof deleteReview;
