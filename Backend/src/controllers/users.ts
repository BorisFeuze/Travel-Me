import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { User } from '#models';
import { userInputSchema, userSchema } from '#schemas';
import { type z } from 'zod/v4';

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = z.infer<typeof userSchema>;

export const getUsers: RequestHandler<{}, UserDTO[]> = async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

export const createUser: RequestHandler<{}, UserDTO, UserInputDTO> = async (req, res) => {
  const newUser = await User.create<UserInputDTO>(req.body);
  res.status(201).json(newUser);
};

export const getSingleUser: RequestHandler<{ id: string }, UserDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const user = await User.findById(id).lean();
  if (!user) throw new Error(`User with id of ${id} doesn't exist`, { cause: 404 });
  res.send(user);
};

export const updateUser: RequestHandler<{ id: string }, UserDTO, UserInputDTO> = async (req, res) => {
  const {
    params: { id },
    body: { firstName, lastName, email, password, roles, phoneNumber }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const user = await User.findById(id);
  if (!user) throw new Error(`user with id of ${id} doesn't exist`, { cause: { status: 404 } });

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phoneNumber = phoneNumber;
  user.password = password;
  user.roles = roles || [];

  const updatedUser = await user.save();

  res.json(updatedUser);
};

export const deleteUser: RequestHandler<{ id: string }, SuccessMsg> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) throw new Error(`User with id of ${id} doesn't exist`, { cause: 404 });
  res.json({ message: `User with id of ${id} was deleted` });
};
