export interface CachePort {
	get<T>(key: string): Promise<T | null>;
	set(key: string, value: unknown): Promise<void>;
	has(key: string): Promise<boolean>;
	del(key: string): Promise<void>;
	delByPattern(pattern: string): Promise<void>;
}
