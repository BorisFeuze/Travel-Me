import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const userProfileInputSchema = z.strictObject({
  pictureURL: z.string().optional().default(''),
  userId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid user ID')
    .transform(val => val.toString()),
  age: z.coerce.number().default(18),
  continent: z.string(),
  country: z.string(),
  gender: z.string().min(1),
  skills: z.array(z.string().default('')),
  languages: z.array(z.string().default('')),
  educations: z.array(z.string().default(''))
});

export const userProfileSchema = z.strictObject({
  ...userProfileInputSchema.shape,
  ...dbEntrySchema.shape
});
