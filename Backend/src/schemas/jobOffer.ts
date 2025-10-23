import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

const coercedString = (val: string | string[]) => {
  if (Array.isArray(val)) {
    for (const a of val) return a;
  } else {
    return val;
  }
};

export const genderSchema = z.strictObject({
  male: z.boolean().default(false),
  female: z.boolean().default(false),
  other: z.boolean().default(false)
});

export const jobOfferInputSchema = z.strictObject({
  location: z.preprocess(coercedString, z.string()),
  userProfileId: z.preprocess(
    coercedString,
    z.union([
      z
        .string('userProfileId must be a string')
        .min(1, 'userProfileId is required')
        .refine(val => {
          return isValidObjectId(val);
        }, 'Invalid userProfile ID'),
      z.instanceof(Types.ObjectId)
    ])
  ),
  pictureURL: z.array(z.string().default('')),
  description: z.preprocess(coercedString, z.string()),
  needs: z.array(z.string().default('')),
  languages: z.array(z.preprocess(coercedString, z.string().default('')))
});

export const jobOfferSchema = z.strictObject({
  ...jobOfferInputSchema.shape,
  ...dbEntrySchema.shape
});
