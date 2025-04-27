import type { ICacheService } from "./interfaces/cache.service.interface";

export class CacheService {
  constructor(private cache: Map<string, unknown> = new Map()) {}

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T;
  }

  set(key: string, value: unknown): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  del(key: string): void {
    // Check if the key ends with a space followed by a number
    const regex = new RegExp(`^${key}$`);

    if (!regex.test(key)) {
      // If it doesn't match, delete only the key.
      this.cache.delete(key);
      return;
    }

    // Iterate and delete.
    for (const k of Array.from(this.cache.keys())) {
      if (k.startsWith(key)) {
        this.cache.delete(k);
      }
    }
  }
}
