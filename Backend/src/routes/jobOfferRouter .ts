import { Router } from 'express';
import { validateZod, authenticate, hasRole } from '#middlewares';
import { createJobOffer, deleteJobOffer, getJobOffers, getSingleJobOffer, updateJobOffer } from '#controllers';
import { jobOfferInputSchema, paramSchema } from '#schemas';

const jobOffersRouter = Router();

jobOffersRouter
  .route('/')
  .get(getJobOffers)
  .post(authenticate('strict'), /*hasRole('self', 'admin'),*/ validateZod(jobOfferInputSchema, 'body'), createJobOffer);
jobOffersRouter.use('/:id', validateZod(paramSchema, 'params'));
jobOffersRouter
  .route('/:id')
  .get(getSingleJobOffer)
  .put(authenticate('strict'), hasRole('self', 'admin'), validateZod(jobOfferInputSchema, 'body'), updateJobOffer)
  .delete(authenticate('strict'), hasRole('self', 'admin'), deleteJobOffer);

export default jobOffersRouter;
