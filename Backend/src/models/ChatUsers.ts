import { model, Schema } from 'mongoose';

const Chat = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    message: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model('chat', Chat);
