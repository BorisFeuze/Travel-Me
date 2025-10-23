import { Router } from 'express';
import { validateZod, authenticate, hasRole2, formMiddleWare, cloudUploader } from '#middlewares';
import { validateZod, authenticate, hasRole2, formMiddleWare, cloudUploader } from '#middlewares';
import { createJobOffer, deleteJobOffer, getJobOffers, getSingleJobOffer, updateJobOffer } from '#controllers';
import { jobOfferInputSchema, paramSchema } from '#schemas';

const jobOffersRouter = Router();

jobOffersRouter.route('/').get(getJobOffers).post(
  formMiddleWare,
  cloudUploader,
  authenticate('strict'),
  /*hasRole2('self', 'admin'),*/
  validateZod(jobOfferInputSchema, 'body'),
  createJobOffer
);
jobOffersRouter.use('/:id', validateZod(paramSchema, 'params'));
jobOffersRouter
  .route('/:id')
  .get(getSingleJobOffer)
  .put(
    formMiddleWare,
    cloudUploader,
    authenticate('strict'),
    hasRole2('self', 'admin'),
    validateZod(jobOfferInputSchema, 'body'),
    updateJobOffer
  )
  .delete(authenticate('strict'), hasRole2('self', 'admin'), deleteJobOffer);

export default jobOffersRouter;
