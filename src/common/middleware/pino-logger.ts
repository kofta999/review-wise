import { pinoLogger } from "hono-pino";
import { Logger } from "../util/logger";

export function loggerMiddleware() {
  return pinoLogger({
    pino: Logger.getLogger(),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
