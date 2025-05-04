import env from "@/env";
import type { CachePort } from "@/ports/output/cache/cache.port";
import { injectable } from "inversify";
import { type RedisClientType, createClient } from "redis";

@injectable()
export class RedisCacheAdapter implements CachePort {
	private client: RedisClientType;
	private DEFAULT_TTL_SECONDS = 300 as const;

	constructor() {
		this.client = createClient({ url: env.REDIS_URL });
		this.client.connect();
	}

	async get<T>(key: string): Promise<T | null> {
		const data = await this.client.GET(key);
		if (!data) return null;

		return JSON.parse(data);
	}

	async set(key: string, value: unknown): Promise<void> {
		return void this.client.SET(key, JSON.stringify(value), {
			EX: this.DEFAULT_TTL_SECONDS,
		});
	}

	async has(key: string): Promise<boolean> {
		return (await this.client.EXISTS(key)) !== 0;
	}

	async del(key: string): Promise<void> {
		return void this.client.DEL(key);
	}

	async delByPattern(pattern: string): Promise<void> {
		const keys = await this.client.KEYS(pattern);
		console.log(keys);

		return void Promise.all(keys.map((k) => this.client.DEL(k)));
	}
}
