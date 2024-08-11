import { z } from 'zod';

export const SignupFormSchema = z.object({
  username: z.string().min(1, { message: 'Username must be at least 1 character long.' }).trim(),
  password: z.string().min(1, { message: 'Password must be at least 1 character long' }).trim(),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
