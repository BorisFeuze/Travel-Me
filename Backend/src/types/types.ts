import type { z } from 'zod';
import type { promptBodySchema } from '#schemas';
import { registerAuthSchema, loginSchema, userProfileSchema, userSchema, userAuthSchema } from '#schemas';

export type IncomingPrompt = z.infer<typeof promptBodySchema>;

export type ErrorResponseDTO = {
  success: false;
  error: string;
};

export type PostDTO = {
  title: string;
  content: string;
};
export type RegisterInputDTO = z.infer<typeof registerAuthSchema>;
export type LoginInputDTO = z.infer<typeof loginSchema>;
export type UserInputDTO = z.infer<typeof userSchema>;
export type UserAuthInputDTO = z.infer<typeof userAuthSchema>;

export type UserProfileSchemaDTO = z.infer<typeof userProfileSchema>;

declare global {
  type SuccessMsg = { message: string };
}
export {};
