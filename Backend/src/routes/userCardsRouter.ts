import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createUserCard, deleteUserCard, getAllUserCards, getSingleUserCard, updateUserCard } from '#controllers';
import { userCardInputSchema, querySchema, paramSchema } from '#schemas';

const userCardsRouter = Router();

userCardsRouter
  .route('/')
  .get(validateZod(querySchema, 'query'), getAllUserCards)
  .post(authenticate, /* hasRole('self', 'admin'),*/ validateZod(userCardInputSchema, 'body'), createUserCard);
userCardsRouter.use('/:id', validateZod(paramSchema, 'params'));
userCardsRouter
  .route('/:id')
  .get(getSingleUserCard)
  .put(authenticate, hasRole('self', 'admin'), validateZod(userCardInputSchema, 'body'), updateUserCard)
  .delete(authenticate, hasRole('self', 'admin'), deleteUserCard);

export default userCardsRouter;
