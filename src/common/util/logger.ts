import env from "@/env";
import pino, { type Logger as PinoLogger } from "pino";

export class Logger {
	private static instance: PinoLogger | null = null;

	// Prevent instantiation
	private constructor() {}

	/**
	 * Get the singleton Pino logger instance
	 * @returns The Pino logger instance
	 */
	public static getLogger(): PinoLogger {
		if (!Logger.instance) {
			Logger.instance = pino({
				// Any configuration options can go here
				level: env.LOG_LEVEL,
				// formatters: {...},
				// redact: [...],
			});
		}
		return Logger.instance;
	}
}
