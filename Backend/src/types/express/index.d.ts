import { userSchema, userCardSchema, signInSchema, querySchema } from '#schemas';
import { z } from 'zod/v4';
import { User, UserCard, Post } from '#models';

declare global {
  type UserRequestBody = z.infer<typeof userSchema>;
  type UserCardRequestBody = z.infer<typeof userCardSchema>;
  type SignInRequestBody = z.infer<typeof signInSchema>;

  type SanitizedBody = UserRequestBody | UserCardRequestBody | SignInRequestBody;

  namespace Express {
    export interface Request {
      sanitQuery?: z.infer<typeof querySchema>;
      userCard?: InstanceType<typeof UserCard>;
      user?: {
        id: string;
        roles: string[];
        post?: InstanceType<typeof Post>;
      };
    }
  }
}
export {};
