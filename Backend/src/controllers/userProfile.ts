import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { UserProfile } from '#models';
import { type z } from 'zod/v4';
import type { userProfileInputSchema, userProfileSchema } from '#schemas';

type UserProfileInputDTO = z.infer<typeof userProfileInputSchema>;
type UserProfileDTO = z.infer<typeof userProfileSchema>;

export const getAllUserProfiles: RequestHandler<{}, UserProfileDTO[]> = async (req, res) => {
  const userId = req.sanitQuery?.Id;

  let UserProfiles: UserProfileDTO[];
  if (userId) {
    UserProfiles = await UserProfile.find({ userId: userId }).lean();
  } else {
    UserProfiles = await UserProfile.find().lean().populate('userId');
  }
  res.json(UserProfiles);
};

export const createUserProfile: RequestHandler<{}, UserProfileDTO, UserProfileInputDTO> = async (req, res) => {
  const {
    body: { pictureURL, userId, age, continent, country, gender, skills, languages, educations }
  } = req;
  let newUserProfile;
  const UserProfiles = await UserProfile.find();
  const isCard = UserProfiles.some(c => c.userId.toString() === userId.toString());
  if (!isCard) {
    newUserProfile = await UserProfile.create({
      pictureURL,
      userId,
      age,
      continent,
      country,
      gender,
      skills,
      languages,
      educations
    });
  }
  res.status(201).json(newUserProfile);
};

export const getSingleUserProfile: RequestHandler<{ id: string }, UserProfileDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const userProfile = await UserProfile.findById(id).lean().populate('userId');
  if (!userProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });
  res.json(userProfile);
};

export const updateUserProfile: RequestHandler<{ id: string }, UserProfileDTO, UserProfileInputDTO> = async (
  req,
  res
) => {
  const {
    params: { id },
    body: { pictureURL, userId, age, continent, country, gender, skills, languages, educations },
    userProfile
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  if (!userProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });

  userProfile.pictureURL = pictureURL;
  userProfile.userId = userId;
  userProfile.age = age;
  userProfile.continent = continent;
  userProfile.country = country;
  userProfile.gender = gender;
  userProfile.skills = skills || [];
  userProfile.languages = languages || [];
  userProfile.educations = educations || [];

  const updatedUserProfile = await userProfile.save();

  res.json(updatedUserProfile);
};

export const deleteUserProfile: RequestHandler<{ id: string }, SuccessMsg> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const deletedUserProfile = await UserProfile.findByIdAndDelete(id).populate('userId');
  if (!deletedUserProfile) throw new Error(`UserProfile with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: `UserProfile with id of ${id} was deleted` });
};
