export interface ICacheService {
  get<T>(key: string): T | undefined;
  set(key: string, value: unknown): void;
  has(key: string): boolean;
  del(key: string): void;
}
