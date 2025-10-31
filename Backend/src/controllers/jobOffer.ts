import type { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { JobOffer } from '#models';
import { jobOfferInputSchema, jobOfferSchema, availabilityItemSchema } from '#schemas';
import { type z } from 'zod/v4';

type JobOfferInputDTO = z.infer<typeof jobOfferInputSchema>;
type JobofferDTO = z.infer<typeof jobOfferSchema>;
type GetJobOffersType = SuccessMsg & { jobOffers: JobofferDTO[] };
type JobOfferType = SuccessMsg & { jobOffer: JobofferDTO };
type AvailabilityType = z.infer<typeof availabilityItemSchema>;

export const getJobOffers: RequestHandler<{}, GetJobOffersType> = async (req, res) => {
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
  const {
    title,
    continent,
    country,
    location,
    userProfileId,
    pictureURL,
    description,
    needs,
    languages,
    availability
  } = req.body;
  const jobOffer = await JobOffer.create<JobOfferInputDTO>({
    title,
    continent,
    country,
    location,
    userProfileId,
    pictureURL,
    description,
    needs,
    languages,
    availability
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
    body: { title, continent, country, location, pictureURL, userProfileId, description, needs, languages },
    jobOffer
  } = req;

  const existingPictureURLs = (req.body as any).existingPictureURLs;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  if (!jobOffer) throw new Error(`jobOffer with id of ${id} doesn't exist`, { cause: 404 });

  let pictureURLs: string[] = [];

  if (existingPictureURLs) {
    try {
      const existing = typeof existingPictureURLs === 'string' 
        ? JSON.parse(existingPictureURLs) 
        : existingPictureURLs;
      pictureURLs = Array.isArray(existing) ? existing : [];
    } catch (e) {
      console.error('Error parsing existingPictureURLs:', e);
    }
  }

  if (req.body.pictureURL && Array.isArray(req.body.pictureURL)) {
    const newUrls = req.body.pictureURL;
    pictureURLs = [...pictureURLs, ...newUrls];
  }

  jobOffer.title = title;
  jobOffer.continent = continent;
  jobOffer.country = country;
  jobOffer.location = location;
  jobOffer.userProfileId = userProfileId as Types.ObjectId;
  jobOffer.pictureURL = pictureURLs;
  jobOffer.description = description;
  jobOffer.needs = needs || [];
  jobOffer.languages = languages || [];

  if (Array.isArray(req.body.availability)) {
    jobOffer.availability.splice(0, jobOffer.availability.length, ...req.body.availability);
  } else if (req.body.availability) {
    jobOffer.availability.splice(0, jobOffer.availability.length, req.body.availability);
  } else {
    jobOffer.availability.splice(0, jobOffer.availability.length); 
  }

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
