import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { Types } from 'mongoose';

export const chatUsersInputSchema = z.strictObject({
  senderId: z.instanceof(Types.ObjectId),
  receiverId: z.instanceof(Types.ObjectId),
  message: z.string(),
  image: z.string(),
  seen: z.boolean().default(false)
});

export const chatUsersSchema = z.strictObject({
  ...chatUsersInputSchema.shape,
  ...dbEntrySchema.shape
});
