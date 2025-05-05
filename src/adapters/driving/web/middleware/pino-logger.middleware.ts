import { Logger } from "@/common/util/logger";
import { pinoLogger } from "hono-pino";

export function loggerMiddleware() {
	return pinoLogger({
		pino: Logger.getLogger(),
		http: {
			reqId: () => crypto.randomUUID(),
		},
	});
}
