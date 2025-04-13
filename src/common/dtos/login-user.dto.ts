import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
