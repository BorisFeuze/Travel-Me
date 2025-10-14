import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createUser, deleteUser, getUsers, getSingleUser, updateUser } from '#controllers';
import { userInputSchema, paramSchema } from '#schemas';

const usersRouter = Router();

usersRouter
  .route('/')
  .get(getUsers)
  .post(authenticate, hasRole('self', 'admin'), validateZod(userInputSchema, 'body'), createUser);
usersRouter.use('/:id', validateZod(paramSchema, 'params'));
usersRouter
  .route('/:id')
  .get(getSingleUser)
  .put(authenticate, hasRole('self', 'admin'), validateZod(userInputSchema, 'body'), updateUser)
  .delete(authenticate, hasRole('self', 'admin'), deleteUser);

export default usersRouter;
