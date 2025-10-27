import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types, isValidObjectId } from 'mongoose';

export const chatUsersInputSchema = z.strictObject({
  // senderId: z.union([
  //   z
  //     .string('userId must be a string')
  //     .min(1, 'userId is required')
  //     .refine(val => {
  //       return isValidObjectId(val);
  //     }, 'Invalid user ID'),
  //   z.instanceof(Types.ObjectId)
  // ]),
  // receiverId: z.union([
  //   z
  //     .string('userId must be a string')
  //     .min(1, 'userId is required')
  //     .refine(val => {
  //       return isValidObjectId(val);
  //     }, 'Invalid user ID'),
  //   z.instanceof(Types.ObjectId)
  // ]),
  message: z.string().optional(),
  image: z.string().optional(),
  seen: z.boolean().default(false)
});

export const chatUsersSchema = z.strictObject({
  ...chatUsersInputSchema.shape,
  ...dbEntrySchema.shape
});
