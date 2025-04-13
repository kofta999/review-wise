import { z } from "zod";

export const RegisterBusinessSchema = z.object({
  name: z.string(),
  description: z.string(),
  email: z.string(),
  password: z.string(),
});

export type RegisterBusinessDTO = z.infer<typeof RegisterBusinessSchema>;
