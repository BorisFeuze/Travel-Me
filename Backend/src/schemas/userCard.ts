import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const scoreSchema = z
  .strictObject({
    wins: z.coerce.number().min(0).default(0),
    losses: z.coerce.number().min(0).default(0)
  })
  .optional()
  .nullish();

export const userCardInputSchema = z.strictObject({
  userId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid user ID')
    .transform(val => val.toString()),
  points: z.coerce.number().default(0).optional().nullish(),
  score: scoreSchema,
  pokemonId: z.coerce.number().optional().nullish().default(null)
});

export const userCardSchema = z.strictObject({
  ...userCardInputSchema.shape,
  ...dbEntrySchema.shape
});
