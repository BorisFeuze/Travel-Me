import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import {
  createuserProfile,
  deleteuserProfile,
  getAlluserProfiles,
  getSingleuserProfile,
  updateuserProfile
} from '#controllers';
import { userProfileInputSchema, querySchema, paramSchema } from '#schemas';

const userProfilesRouter = Router();

userProfilesRouter
  .route('/')
  .get(validateZod(querySchema, 'query'), getAlluserProfiles)
  .post(
    authenticate('strict'),
    /* hasRole('self', 'admin'),*/ validateZod(userProfileInputSchema, 'body'),
    createuserProfile
  );
userProfilesRouter.use('/:id', validateZod(paramSchema, 'params'));
userProfilesRouter
  .route('/:id')
  .get(getSingleuserProfile)
  .put(authenticate, hasRole('self', 'admin'), validateZod(userProfileInputSchema, 'body'), updateuserProfile)
  .delete(authenticate, hasRole('self', 'admin'), deleteuserProfile);

export default userProfilesRouter;
