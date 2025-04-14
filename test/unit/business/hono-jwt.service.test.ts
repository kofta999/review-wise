import { beforeEach, describe, expect, it, jest, mock } from "bun:test";
import { HonoJwtService } from "@/business/hono-jwt.service";
import { sign, verify } from "hono/jwt";

// Mock Hono JWT functions
mock.module("hono/jwt", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("HonoJwtService", () => {
  const secret = "test-secret";
  let jwtService: HonoJwtService<{ userId: number }>;

  beforeEach(() => {
    jwtService = new HonoJwtService<{ userId: number }>(secret);
    jest.clearAllMocks();
  });

  describe("sign", () => {
    it("Should sign a payload and return a JWT token", async () => {
      const payload = { userId: 123 };
      const expectedToken = "jwt.token.string";

      (sign as jest.Mock).mockResolvedValueOnce(expectedToken);

      const result = await jwtService.sign(payload);

      expect(result).toBe(expectedToken);
      expect(sign).toHaveBeenCalledWith(payload, secret);
      expect(sign).toHaveBeenCalledTimes(1);
    });

    it("Should propagate errors from sign function", async () => {
      const payload = { userId: 123 };
      const error = new Error("Signing failed");

      (sign as jest.Mock).mockRejectedValueOnce(error);

      await expect(jwtService.sign(payload)).rejects.toThrow(error);
      expect(sign).toHaveBeenCalledTimes(1);
    });
  });

  describe("verify", () => {
    it("Should verify a token and return the decoded payload", async () => {
      const token = "jwt.token.string";
      const expectedPayload = { userId: 123 };

      (verify as jest.Mock).mockResolvedValueOnce(expectedPayload);

      const result = await jwtService.verify(token);

      expect(result).toEqual(expectedPayload);
      expect(verify).toHaveBeenCalledWith(token, secret);
      expect(verify).toHaveBeenCalledTimes(1);
    });

    it("Should propagate errors from verify function", async () => {
      const token = "invalid.token";
      const error = new Error("Invalid token");

      (verify as jest.Mock).mockRejectedValueOnce(error);

      await expect(jwtService.verify(token)).rejects.toThrow(error);
      expect(verify).toHaveBeenCalledTimes(1);
    });
  });
});
