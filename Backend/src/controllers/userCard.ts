import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { UserCard } from '#models';
import { type z } from 'zod/v4';
import type { userCardInputSchema, userCardSchema } from '#schemas';

type UserCardInputDTO = z.infer<typeof userCardInputSchema>;
type UserCardDTO = z.infer<typeof userCardSchema>;

export const getAllUserCards: RequestHandler<{}, UserCardDTO[]> = async (req, res) => {
  const userId = req.sanitQuery?.userId;

  let userCards: UserCardDTO[];
  if (userId) {
    userCards = await UserCard.find({ userId: userId }).lean();
  } else {
    userCards = await UserCard.find().lean().populate('userId');
  }
  res.json(userCards);
};

export const createUserCard: RequestHandler<{}, UserCardDTO, UserCardInputDTO> = async (req, res) => {
  const {
    body: { userId, points, score }
  } = req;
  let newUserCard;
  const UserCards = await UserCard.find();
  const isCard = UserCards.some(c => c.userId.toString() === userId.toString());
  if (!isCard) {
    newUserCard = await UserCard.create({ userId, points, score });
  }
  res.status(201).json(newUserCard);
};

export const getSingleUserCard: RequestHandler<{ id: string }, UserCardDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const userCard = await UserCard.findById(id).lean().populate('userId');
  if (!userCard) throw new Error(`UserCard with id of ${id} doesn't exist`, { cause: 404 });
  res.json(userCard);
};

export const updateUserCard: RequestHandler<{ id: string }, UserCardDTO, UserCardInputDTO> = async (req, res) => {
  const {
    params: { id },
    body: { points, score },
    userCard
  } = req;
  const { wins, losses } = score || { wins: 0, losses: 0 };

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  if (!userCard) throw new Error(`UserCard with id of ${id} doesn't exist`, { cause: 404 });

  userCard.points = points! <= 100 ? Math.max(userCard.points - points!, 0) : userCard.points + points!;
  userCard.score = { wins: score!.wins + wins, losses: score!.losses + losses };

  const updatedUserCard = await userCard.save();

  res.json(updatedUserCard);
};

export const deleteUserCard: RequestHandler<{ id: string }, SuccessMsg> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const deletedUserCard = await UserCard.findByIdAndDelete(id).populate('userId');
  if (!deletedUserCard) throw new Error(`UserCard with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: `UserCard with id of ${id} was deleted` });
};
