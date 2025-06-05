import { z } from "zod";

export const SSigninSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type TSigninSchema = z.infer<typeof SSigninSchema>;
