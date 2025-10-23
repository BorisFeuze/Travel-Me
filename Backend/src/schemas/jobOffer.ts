import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const genderSchema = z.strictObject({
  male: z.boolean().default(false),
  female: z.boolean().default(false),
  other: z.boolean().default(false)
});

export const jobOfferInputSchema = z.strictObject({
  location: z.union([z.string(), z.array(z.string())]).transform(val =>
    Array.isArray(val) ? val[0] : val
  ),
  userProfileId: z.union([
    z
      .string()
      .min(1, 'userProfileId is required')
      .refine(val => isValidObjectId(val), 'Invalid userProfile ID'),
    z.instanceof(Types.ObjectId),
    z.array(z.string()).transform(val => val[0])
  ]),
  
  pictureURL: z
    .union([
      z.array(z.string()).optional(),
      z.string().optional()
    ])
    .transform(val => (typeof val === 'string' ? [val] : val || [])),
  
  description: z.union([z.string(), z.array(z.string())]).transform(val =>
    Array.isArray(val) ? val[0] : val
  ),

   needs: z
    .union([z.string(), z.array(z.string())])
    .transform(val =>
      typeof val === 'string'
        ? JSON.parse(val)
        : val
    ),

    languages: z
    .union([z.string(), z.array(z.string())])
    .transform(val =>
      typeof val === 'string'
        ? JSON.parse(val)
        : val
    )
  
});

export const jobOfferSchema = z.strictObject({
  ...jobOfferInputSchema.shape,
  ...dbEntrySchema.shape
});
