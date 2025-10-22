import { File } from 'formidable';
import { userSchema, UserProfileSchema, signInSchema, querySchema } from '#schemas';
import { z } from 'zod/v4';
import { UserProfile, JobOffer } from '#models';

declare global {
  type UserRequestBody = z.infer<typeof userSchema>;
  type UserProfileRequestBody = z.infer<typeof UserProfileSchema>;
  type SignInRequestBody = z.infer<typeof signInSchema>;

  type SanitizedBody = UserRequestBody | UserProfileRequestBody | SignInRequestBody;

  namespace Express {
    export interface Request {
      sanitQuery?: z.infer<typeof querySchema>;
      userProfile?: InstanceType<typeof UserProfile>;
      jobOffer?: InstanceType<typeof JobOffer>;
      user?: {
        id: string;
        roles: string[];
      };
      pictureURL?: File;
    }
  }
}
export {};
