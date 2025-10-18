import { Router } from 'express';
import { validateZod, authenticate } from '#middlewares';
import { createUser, deleteUser, getUsers, getSingleUser, updateUser } from '#controllers';
import { userInputSchema, paramSchema } from '#schemas';

const usersRouter = Router();

usersRouter.route('/').get(getUsers).post(authenticate('strict'), validateZod(userInputSchema, 'body'), createUser);
usersRouter.use('/:id', validateZod(paramSchema, 'params'));
usersRouter
  .route('/:id')
  .get(getSingleUser)
  .put(authenticate('strict'), validateZod(userInputSchema, 'body'), updateUser)
  .delete(authenticate('strict'), deleteUser);

export default usersRouter;
