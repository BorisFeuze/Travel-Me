import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const chatUsersInputSchema = z.strictObject({
  userProfileId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid userProfile ID')
    .transform(val => val.toString()),

  message: z.string()
});

export const chatUsersSchema = z.strictObject({
  ...chatUsersInputSchema.shape,
  ...dbEntrySchema.shape
});
