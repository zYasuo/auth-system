import { z } from 'zod';

export const SFormRegisterSchemaValidator = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: 'Name must contain only letters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(100, { message: 'Email must be at most 100 characters long' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(32, { message: 'Password must be at most 32 characters long' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
});

export type TFormRegisterValidator = z.infer<typeof SFormRegisterSchemaValidator>;