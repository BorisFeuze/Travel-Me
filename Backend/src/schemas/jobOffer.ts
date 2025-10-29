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

const coerceAvailabilityArray = (val: unknown) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }

  if (Array.isArray(val)) {
    if (val.length === 1 && typeof val[0] === 'string') {
      try {
        const parsed = JSON.parse(val[0] as string);
        return parsed;
      } catch {
        return val;
      }
    }

    const everyItemIsString = val.every(item => typeof item === 'string');
    if (everyItemIsString) {
      try {
        const parsedEach = val.map(item => JSON.parse(item as string));
        return parsedEach;
      } catch {
        return val;
      }
    }
    return val;
  }
  return val;
};

export const genderSchema = z.strictObject({
  male: z.boolean().default(false),
  female: z.boolean().default(false),
  other: z.boolean().default(false)
});

export const availabilityItemSchema = z.strictObject({
  from: z.preprocess(val => (val ? new Date(val as string) : undefined), z.date().optional()),
  to: z.preprocess(val => (val ? new Date(val as string) : undefined), z.date().optional())
});

export const jobOfferInputSchema = z.strictObject({
  title: z.preprocess(coercedString, z.string()),
  continent: z.preprocess(coercedString, z.string()),
  country: z.preprocess(coercedString, z.string()),
  location: z.preprocess(coercedString, z.string()),
  userProfileId: z.preprocess(
    coercedString,
    z.union([
      z
        .string('userProfileId must be a string')
        .min(1, 'userProfileId is required')
        .refine(val => isValidObjectId(val), 'Invalid userProfile ID'),
      z.instanceof(Types.ObjectId)
    ])
  ),
  pictureURL: z.array(z.string().default('')).optional(),
  description: z.preprocess(coercedString, z.string()),
  needs: z.array(z.preprocess(coercedString, z.string().default(''))),
  languages: z.array(z.preprocess(coercedString, z.string().default(''))),
  availability: z.preprocess(coerceAvailabilityArray, z.array(availabilityItemSchema)).optional()
});

export const jobOfferSchema = z.strictObject({
  ...jobOfferInputSchema.shape,
  ...dbEntrySchema.shape
});
