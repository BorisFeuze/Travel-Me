import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { JobOffer } from '#models';
import { jobOfferInputSchema, jobOfferSchema } from '#schemas';
import { type z } from 'zod/v4';

type JobOfferInputDTO = z.infer<typeof jobOfferInputSchema>;
type JobofferDTO = z.infer<typeof jobOfferSchema>;
type GetJobOffersType = SuccessMsg & { jobOffers: JobofferDTO[] };
type JobOfferType = SuccessMsg & { jobOffer: JobofferDTO };

export const getJoboffers: RequestHandler<{}, GetJobOffersType> = async (req, res) => {
  const userProfileId = req.sanitQuery?.userProfileId;

  let jobOffers: JobofferDTO[];
  if (userProfileId) {
    jobOffers = await JobOffer.find({ userProfileId: userProfileId }).lean();
  } else {
    jobOffers = await JobOffer.find().lean();
  }
  res.json({ message: 'List of jobOffers', jobOffers });
};

export const createJobOffer: RequestHandler<{}, JobOfferType, JobOfferInputDTO> = async (req, res) => {
  const { location, userProfileId, pictureGallery, description, needs, languages } = req.body;
  const jobOffer = await JobOffer.create<JobOfferInputDTO>({
    location,
    userProfileId,
    pictureGallery,
    description,
    needs,
    languages
  });
  res.status(201).json({ message: 'jobOffer created', jobOffer });
};

export const getSingleJobOffer: RequestHandler<{ id: string }, JobOfferType> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const jobOffer = await JobOffer.findById(id).lean();
  if (!jobOffer) throw new Error(`JobOffer with id of ${id} doesn't exist`, { cause: 404 });
  res.send({ message: 'searched jobOffer', jobOffer });
};

export const updateJobOffer: RequestHandler<{ id: string }, JobOfferType, JobOfferInputDTO> = async (req, res) => {
  const {
    params: { id },
    body: { location, userProfileId, pictureGallery, description, needs, languages }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const jobOffer = await JobOffer.findById(id);
  if (!jobOffer) throw new Error(`jobOffer with id of ${id} doesn't exist`, { cause: { status: 404 } });

  jobOffer.location = location;
  jobOffer.userProfileId = userProfileId;
  jobOffer.pictureGallery = pictureGallery || [];
  jobOffer.description = description;
  jobOffer.needs = needs || [];
  jobOffer.languages = languages || [];

  await jobOffer.save();

  res.json({ message: 'updated jobOffer', jobOffer });
};

export const deleteJobOffer: RequestHandler<{ id: string }, SuccessMsg> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const deletedUser = await JobOffer.findByIdAndDelete(id);
  if (!deletedUser) throw new Error(`JobOffer with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: `JobOffer with id of ${id} was deleted` });
};
