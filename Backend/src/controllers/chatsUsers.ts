import { Chat, User } from '#models';
import type { RequestHandler } from 'express';
import { io, userSocketMap } from '#utils';
import { v2 as cloudinary } from 'cloudinary';

type unseenMessagesType = {
  'user._id'?: number;
};

export const getUsersToChatWith: RequestHandler = async (req, res) => {
  const userId = req.user!.id;
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

  // count number of messages not seen
  const unseenMessages: unseenMessagesType = {};
  const promises = filteredUsers.map(async user => {
    const chats = await Chat.find({ senderId: user._id, receiverId: userId, seen: false });
    if (chats.length > 0) {
      unseenMessages['user._id'] = chats.length;
    }
  });
  await Promise.all(promises);

  res.json({ users: filteredUsers, unseenMessages });
};

//Get all messages for selected user

export const getChats: RequestHandler = async (req, res) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user!.id;

  const chats = await Chat.find({
    $or: [
      { senderId: myId, receiverId: selectedUserId },
      { senderId: selectedUserId, receiverId: myId }
    ]
  });
  await Chat.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

  res.json({ chats });
};

// mark chat as seen using chats

export const markChatAsSeen: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await Chat.findByIdAndUpdate(id, { seen: true });
  res.json({ message: 'chat updated' });
};

//send message to selected user

export const sendChat: RequestHandler = async (req, res) => {
  const { message, image } = req.body;
  const receiverId = req.params.id;
  const senderId = req.user!.id;

  let imageUrl;

  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  const newChat = await Chat.create({
    senderId,
    receiverId,
    message,
    image: imageUrl
  });

  //Emit the new message to the receiver's socket

  const receiverSocketId = userSocketMap.receiverId;
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newChat', newChat);
  }

  res.json(newChat);
};
