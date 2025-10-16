import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { JobOffer } from '#models';
import { jobOfferInputSchema, jobOfferSchema } from '#schemas';
import { type z } from 'zod/v4';

type JobOfferInputDTO = z.infer<typeof jobOfferInputSchema>;
type JobofferDTO = z.infer<typeof jobOfferSchema>;

export const getJoboffers: RequestHandler<{}, JobofferDTO[]> = async (req, res) => {
  const userProfileId = req.sanitQuery?.Id;

  let JobOffers: JobofferDTO[];
  if (userProfileId) {
    JobOffers = await JobOffer.find({ userProfileId: userProfileId }).lean();
  } else {
    JobOffers = await JobOffer.find().lean();
  }
  res.json(JobOffers);
};

export const createUser: RequestHandler<{}, JobofferDTO, JobOfferInputDTO> = async (req, res) => {
  const { location, userProfileId, pictureGallery, description, needs, languages } = req.body;
  const newUser = await JobOffer.create<JobOfferInputDTO>({
    location,
    userProfileId,
    pictureGallery,
    description,
    needs,
    languages
  });
  res.status(201).json(newUser);
};

export const getSingleJobOffer: RequestHandler<{ id: string }, JobofferDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const jobOffer = await JobOffer.findById(id).lean();
  if (!jobOffer) throw new Error(`JobOffer with id of ${id} doesn't exist`, { cause: 404 });
  res.send(jobOffer);
};

export const updateJobOffer: RequestHandler<{ id: string }, JobofferDTO, JobOfferInputDTO> = async (req, res) => {
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

  const updatedUser = await jobOffer.save();

  res.json(updatedUser);
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
