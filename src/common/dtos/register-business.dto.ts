import { z } from "zod";

export const RegisterBusinessSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(10),
	email: z.string().email(),
	password: z.string().min(6),
});

export type RegisterBusinessDTO = z.infer<typeof RegisterBusinessSchema>;
