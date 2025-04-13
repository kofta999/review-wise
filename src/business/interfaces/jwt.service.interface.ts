export interface IJwtService {
  sign(payload: unknown): Promise<string>;
  verify(token: string): Promise<unknown>;
}
