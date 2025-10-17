import type { z } from 'zod';
import type { promptBodySchema } from '#schemas';
import { registerSchema, loginSchema, userProfileAuthSchema, userSchema, userAuthSchema } from '#schemas';

export type IncomingPrompt = z.infer<typeof promptBodySchema>;

export type ErrorResponseDTO = {
  success: false;
  error: string;
};

export type PostDTO = {
  title: string;
  content: string;
};
export type RegisterInputDTO = z.infer<typeof registerSchema>;
export type LoginInputDTO = z.infer<typeof loginSchema>;
export type UserInputDTO = z.infer<typeof userSchema>;
export type UserAuthInputDTO = z.infer<typeof userAuthSchema>;

export type UserProfileAuthSchemaDTO = z.infer<typeof userProfileAuthSchema>;

declare global {
  type SuccessMsg = { message: string };
}
export {};
