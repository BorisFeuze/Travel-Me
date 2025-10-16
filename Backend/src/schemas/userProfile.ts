import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const genderSchema = z.strictObject({
  male: z.boolean().default(false),
  female: z.boolean().default(false),
  other: z.boolean().default(false)
});

export const userProfileInputSchema = z.strictObject({
  pictureURL: z.string().optional().default(''),
  userId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid user ID')
    .transform(val => val.toString()),
  age: z.coerce.number().nullish(),
  continent: z.string(),
  country: z.string(),
  gender: genderSchema,
  skills: z.array(z.string().optional()),
  languages: z.array(z.string().optional()),
  educations: z.array(z.string().optional())
});

export const userProfileSchema = z.strictObject({
  ...userProfileInputSchema.shape,
  ...dbEntrySchema.shape
});
