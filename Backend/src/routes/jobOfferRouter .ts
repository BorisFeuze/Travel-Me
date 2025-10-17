import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createJobOffer, deleteJobOffer, getJobOffers, getSingleJobOffer, updateJobOffer } from '#controllers';
import { userInputSchema, paramSchema, jobOfferInputSchema } from '#schemas';

const jobOffersRouter = Router();

jobOffersRouter
  .route('/')
  .get(getJobOffers)
  .post(authenticate('strict'), validateZod(jobOfferInputSchema, 'body'), createJobOffer);
jobOffersRouter.use('/:id', validateZod(paramSchema, 'params'));
jobOffersRouter
  .route('/:id')
  .get(getSingleJobOffer)
  .put(authenticate('strict'), hasRole('self', 'admin'), validateZod(userInputSchema, 'body'), updateJobOffer)
  .delete(authenticate('strict'), hasRole('self', 'admin'), deleteJobOffer);

export default jobOffersRouter;
