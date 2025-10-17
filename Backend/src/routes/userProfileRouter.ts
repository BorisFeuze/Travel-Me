import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import {
  createUserProfile,
  deleteUserProfile,
  getAllUserProfiles,
  getSingleUserProfile,
  updateUserProfile
} from '#controllers';
import { userProfileInputSchema, querySchema, paramSchema } from '#schemas';

const userProfilesRouter = Router();

userProfilesRouter
  .route('/')
  .get(validateZod(querySchema, 'query'), getAllUserProfiles)
  .post(
    authenticate('strict'),
    /*hasRole('self', 'admin'),*/ validateZod(userProfileInputSchema, 'body'),
    createUserProfile
  );
userProfilesRouter.use('/:id', validateZod(paramSchema, 'params'));
userProfilesRouter
  .route('/:id')
  .get(getSingleUserProfile)
  .put(authenticate, hasRole('self', 'admin'), validateZod(userProfileInputSchema, 'body'), updateUserProfile)
  .delete(authenticate, hasRole('self', 'admin'), deleteUserProfile);

export default userProfilesRouter;
