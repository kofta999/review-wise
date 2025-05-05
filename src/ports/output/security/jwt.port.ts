export interface JwtPort {
	sign(payload: unknown): Promise<string>;
	verify(token: string): Promise<unknown>;
}
