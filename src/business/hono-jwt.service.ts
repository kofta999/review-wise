import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { IJwtService } from "./interfaces/jwt.service.interface";

export class HonoJwtService<Payload extends JWTPayload> implements IJwtService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async sign(payload: Payload): Promise<string> {
    return sign(payload, this.secret);
  }

  verify(token: string): Promise<Payload> {
    return verify(token, this.secret) as Promise<Payload>;
  }
}
