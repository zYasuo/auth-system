import { z } from "zod"

export const SForgotPasswordSchemaValidator = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format").toLowerCase().trim(),
})

export type TForgotPasswordSchema = z.infer<typeof SForgotPasswordSchemaValidator>
