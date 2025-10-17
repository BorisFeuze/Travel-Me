import z from 'zod/v4';
import { Types, isValidObjectId } from 'mongoose';

const stringIdSchema = z.string().refine(val => isValidObjectId(val), 'Invalid ID');

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.int().nonnegative()
});

const querySchema = z.strictObject({
  userId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid user ID')
    .optional(),
  userProfileId: z
    .string()
    .refine(val => isValidObjectId(val), 'Invalid user ID')
    .optional()
});

const paramSchema = z.strictObject({
  userId: stringIdSchema,
  userProfileId: stringIdSchema
});

export { dbEntrySchema, paramSchema, querySchema };
