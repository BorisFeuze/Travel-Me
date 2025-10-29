import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';

export const userInputSchema = z.strictObject({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string(),
  password: z.string().min(8).max(520),
  phoneNumber: z.string().min(1).max(520),
  roles: z.array(z.string().min(1).max(50).default('volunteer'))
});

export const signInSchema = userInputSchema.omit({ firstName: true, lastName: true, phoneNumber: true });

export const userSchema = z.strictObject({
  ...userInputSchema.shape,
  ...dbEntrySchema.shape
});
