import { TYPES } from "@/common/types";
import type { JwtPort } from "@/ports/output/security/jwt.port";
import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { inject, injectable } from "inversify";

@injectable()
export class HonoJwtAdapter<Payload extends JWTPayload> implements JwtPort {
	private secret: string;
	private TOKEN_EXP_SECONDS = 60 as const;

	constructor(@inject(TYPES.JWT_SECRET) secret: string) {
		this.secret = secret;
	}

	async sign(payload: Payload): Promise<string> {
		const nowSeconds = Math.floor(Date.now() / 1000);
		return sign(
			{
				...payload,
				exp: nowSeconds + this.TOKEN_EXP_SECONDS,
				iat: nowSeconds,
			},
			this.secret,
		);
	}

	verify(token: string): Promise<Payload> {
		return verify(token, this.secret) as Promise<Payload>;
	}
}
