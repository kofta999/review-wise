// import { config } from "dotenv";
// import { expand } from "dotenv-expand";
import type { ZodError } from "zod";
import { z } from "zod";

// expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  PG_HOST: z.string().default("localhost"),
  PG_DB_NAME: z.string().default("review_wise_db"),
  PG_USER: z.string().default("test"),
  PG_PASSWORD: z.string().default("test"),
  PG_PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  console.log(process.env);
  const error = e as ZodError;
  console.error("Invalid Env:");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
