import { Router } from 'express';
import { validateZod, authenticate, hasRole2, formMiddleWare, cloudUploader } from '#middlewares';
import { createJobOffer, deleteJobOffer, getJobOffers, getSingleJobOffer, updateJobOffer } from '#controllers';
import { jobOfferInputSchema, paramSchema, querySchema } from '#schemas';

const jobOffersRouter = Router();

jobOffersRouter.route('/').get(validateZod(querySchema, 'query'), getJobOffers).post(
  formMiddleWare,
  cloudUploader,
  authenticate('strict'),
  // (req, res, next) => {
  //   try {
  //     if (req.body.needs) req.body.needs = JSON.parse(req.body.needs);
  //     if (req.body.languages) req.body.languages = JSON.parse(req.body.languages);
  //     if (req.body.availability) req.body.availability = JSON.parse(req.body.availability);
  //     next();
  //   } catch (err) {
  //     console.error('Fehler beim Parsen:', err);
  //     return res.status(400).json({ message: 'Invalid JSON in FormData' });
  //   }
  // },
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
