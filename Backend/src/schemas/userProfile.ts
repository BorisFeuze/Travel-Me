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

const coercedNumber = (val: number | [number]) => {
  if (Array.isArray(val)) return val[0];
  return val;
};

export const userProfileInputSchema = z.strictObject({
  pictureURL: z.array(
    z
      .url({
        protocol: /^https?$/,
        hostname: z.regexes.domain
      })
      .default(
        'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
      )
  ),
  userId: z
    .preprocess(
      coercedString,
      z.union([
        z
          .string('userId must be a string')
          .min(1, 'userId is required')
          .refine(val => {
            return isValidObjectId(val);
          }, 'Invalid user ID'),
        z.instanceof(Types.ObjectId)
      ])
    )
    .optional(),
  age: z.preprocess(coercedNumber, z.coerce.number().default(18)),
  adresse: z.preprocess(coercedString, z.string()),
  description: z.preprocess(coercedString, z.string()),
  continent: z.preprocess(coercedString, z.string()),
  country: z.preprocess(coercedString, z.string()),
  gender: z.preprocess(coercedString, z.string().min(1)),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()),
  educations: z.array(z.string())
});

export const userProfileSchema = z.strictObject({
  ...userProfileInputSchema.shape,
  ...dbEntrySchema.shape
});
