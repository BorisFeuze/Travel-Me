import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const userProfileInputSchema = z.strictObject({
  pictureURL: z
    .string()
    .default(
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    ),
  userId: z.union([
    z
      .string('userId must be a string')
      .min(1, 'userId is required')
      .refine(val => {
        return isValidObjectId(val);
      }, 'Invalid user ID'),
    z.instanceof(Types.ObjectId)
  ]),
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
