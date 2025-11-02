import type { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { UserProfile } from '#models';
import { type z } from 'zod/v4';
import type { userProfileInputSchema, userProfileSchema, userProfileUpdateSchema } from '#schemas';

type UserProfileInputDTO = z.input<typeof userProfileInputSchema>;
type UserProfileDTO = z.infer<typeof userProfileSchema>;
type GetUserProfilesType = SuccessMsg & { userProfiles: UserProfileDTO[] };
type UserProfileType = SuccessMsg & { userProfile: UserProfileDTO };

export const getAllUserProfiles: RequestHandler<{}, GetUserProfilesType> = async (req, res) => {
  const userId = req.sanitQuery?.userId;

  let userProfiles;
  if (userId) {
    userProfiles = await UserProfile.find({ userId: userId }).lean();
  } else {
    userProfiles = await UserProfile.find().lean().populate('userId', '-password');
  }
  res.json({ message: 'All userProfiles', userProfiles });
};

export const createUserProfile: RequestHandler<{}, SuccessMsg, UserProfileInputDTO> = async (req, res) => {
  const {
    body: { pictureURL, userId, age, continent, country, gender, skills, languages, educations, address, description }
  } = req;

  // console.log(req.body);
  let userProfile: UserProfileDTO;
  const userProfiles = await UserProfile.find();
  const isProfile = userProfiles.some(c => c.userId.toString() === userId?.toString());
  if (!isProfile) {
    userProfile = await UserProfile.create({
      pictureURL,
      userId,
      age,
      continent,
      country,
      gender,
      skills,
      languages,
      educations,
      address,
      description
    });

    res.status(201).json({ message: 'userProfile created' });
  } else {
    res.status(201).json({ message: 'userProfile already exists' });
  }
};

export const getSingleUserProfile: RequestHandler<{ id: string }, UserProfileType> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const userProfile = await UserProfile.findById(id).lean().populate('userId', '-password');
  if (!userProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: 'userProfile created', userProfile });
};

export const updateUserProfile: RequestHandler<
  { id: string },
  UserProfileType,
  z.input<typeof userProfileUpdateSchema>
> = async (req, res) => {
  const { params: { id }, body, userProfile } = req;

  const { existingPictureURL, userId, age, continent, country, gender, skills, languages, educations, address, description, pictureURL } = body;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  if (!userProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });

  let finalPictureURL: string = '';

  const isDefaultUrl = pictureURL && Array.isArray(pictureURL) && pictureURL[0]?.includes('default-avatar-icon');

  if (pictureURL && Array.isArray(pictureURL) && !isDefaultUrl && pictureURL[0]) {
    finalPictureURL = pictureURL[0];
  } else if (existingPictureURL) {
    finalPictureURL = Array.isArray(existingPictureURL) ? existingPictureURL[0] || '' : existingPictureURL;
  } else {
    finalPictureURL = userProfile.pictureURL[0] || '';
  }

  userProfile.pictureURL = finalPictureURL ? [finalPictureURL] : userProfile.pictureURL;
  userProfile.userId = userId as unknown as Types.ObjectId;
  userProfile.age = age as number;
  userProfile.continent = continent as string;
  userProfile.country = country as string;
  userProfile.gender = gender as string;
  userProfile.skills = skills || [];
  userProfile.address = address as string;
  userProfile.description = description as string;
  userProfile.languages = languages || [];
  userProfile.educations = educations || [];

  await userProfile.save();

  res.json({ message: 'userProfile updated', userProfile });
};


export const deleteUserProfile: RequestHandler<{ id: string }, SuccessMsg> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const deletedUserProfile = await UserProfile.findByIdAndDelete(id);
  if (!deletedUserProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: `UserProfile with id of ${id} was deleted` });
};
