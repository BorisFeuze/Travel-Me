import { Router } from 'express';
import { validateZod, authenticate, hasRole1, formMiddleWare, cloudUploader } from '#middlewares';
import {
  createUserProfile,
  deleteUserProfile,
  getAllUserProfiles,
  getSingleUserProfile,
  updateUserProfile
} from '#controllers';
import { userProfileInputSchema, querySchema, paramSchema } from '#schemas';

const userProfilesRouter = Router();

userProfilesRouter.route('/').get(validateZod(querySchema, 'query'), getAllUserProfiles).post(
  /*formMiddleWare,
    cloudUploader*/
  authenticate('strict'),
  validateZod(userProfileInputSchema, 'body'),
  createUserProfile
);
userProfilesRouter.use('/:id', validateZod(paramSchema, 'params'));
userProfilesRouter
  .route('/:id')
  .get(getSingleUserProfile)
  .put(
    /*formMiddleWare,
    cloudUploader*/
    authenticate('strict'),
    hasRole1('self', 'admin'),
    /*validateZod(userProfileInputSchema, 'body'),*/
    updateUserProfile
  )
  .delete(authenticate('strict'), hasRole1('self', 'admin'), deleteUserProfile);

export default userProfilesRouter;
