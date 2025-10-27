import { model, Schema } from 'mongoose';

const ChatUsers = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model('chatuser', ChatUsers);
