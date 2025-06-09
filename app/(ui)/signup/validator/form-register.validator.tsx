import {z} from 'zod';

export const SFormRegisterValidator = z.object({
  name: z
    .string()
    .min(2, {message: 'Name must be at least 2 characters long'})
    .max(50, {message: 'Name must be at most 50 characters long'}),
  email: z
    .string()
    .email({message: 'Invalid email address'})
    .min(5, {message: 'Email must be at least 5 characters long'})
    .max(100, {message: 'Email must be at most 100 characters long'}),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters long'})
    .max(100, {message: 'Password must be at most 100 characters long'}),
});

export type TFormRegisterValidator = z.infer<typeof SFormRegisterValidator>;