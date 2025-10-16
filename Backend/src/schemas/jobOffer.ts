import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const genderSchema = z.strictObject({
  male: z.boolean().default(false),
  female: z.boolean().default(false),
  other: z.boolean().default(false)
});

export const jobOfferInputSchema = z.strictObject({
  location: z.string(),
  userProfileId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid userProfile ID')
    .transform(val => val.toString()),
  pictureGallery: z.array(z.string().optional()),
  description: z.string(),
  needs: z.array(z.string().optional()),
  language: z.array(z.string())
});

export const jobOfferSchema = z.strictObject({
  ...jobOfferInputSchema.shape,
  ...dbEntrySchema.shape
});
