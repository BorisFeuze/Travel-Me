import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createJobOffer, deleteJobOffer, getJobOffers, getSingleJobOffer, updateJobOffer } from '#controllers';
import { jobOfferInputSchema, paramSchema } from '#schemas';

const jobOffersRouter = Router();

jobOffersRouter
  .route('/')
  .get(getJobOffers)
  .post(authenticate, hasRole('self', 'admin'), validateZod(jobOfferInputSchema, 'body'), createJobOffer);
jobOffersRouter.use('/:id', validateZod(paramSchema, 'params'));
jobOffersRouter
  .route('/:id')
  .get(getSingleJobOffer)
  .put(authenticate, hasRole('self', 'admin'), validateZod(jobOfferInputSchema, 'body'), updateJobOffer)
  .delete(authenticate, hasRole('self', 'admin'), deleteJobOffer);

export default jobOffersRouter;
