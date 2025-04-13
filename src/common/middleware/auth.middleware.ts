import { HonoJwtService } from "@/business/hono-jwt.service";
import { createMiddleware } from "hono/factory";
import { UnauthorizedError } from "../errors/unauthorized";
import type { AppBindings } from "../types";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  // TODO: Decouple
  const jwtService = new HonoJwtService<{ email: string; id: string }>(
    "TEST DONT USE IN PROD",
  );
  const header = c.req.header("Authorization");

  if (!header) {
    throw new UnauthorizedError();
  }

  const tokenString = header.substring(7);

  try {
    const payload = await jwtService.verify(tokenString);
    c.set("user", payload);
    await next();
  } catch (error) {
    throw new UnauthorizedError();
  }
});
