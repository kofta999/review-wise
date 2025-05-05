import type { CachePort } from "@/ports/output/cache/cache.port";

export class CacheService implements CachePort {
	constructor(private cache: Map<string, unknown> = new Map()) {}

	get<T>(key: string): Promise<T | null> {
		return new Promise<T | null>((resolve) => {
			resolve(this.cache.get(key) as T | null);
		});
	}

	set(key: string, value: unknown): Promise<void> {
		return new Promise<void>((resolve) => {
			this.cache.set(key, value);
			resolve();
		});
	}

	has(key: string): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			resolve(this.cache.has(key));
		});
	}

	del(key: string): Promise<void> {
		return new Promise((resolve) => {
			this.cache.delete(key);
		});
	}

	delByPattern(pattern: string): Promise<void> {
		return new Promise<void>((resolve) => {
			const regex = new RegExp(`^${pattern}$`);

			if (!regex.test(pattern)) {
				this.cache.delete(pattern);
				resolve();
			} else {
				for (const k of Array.from(this.cache.keys())) {
					if (k.startsWith(pattern)) {
						this.cache.delete(k);
					}
				}
				resolve();
			}
		});
	}
}
