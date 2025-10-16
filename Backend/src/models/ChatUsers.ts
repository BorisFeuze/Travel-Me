import { model, Schema } from 'mongoose';

const SchemaChat = new Schema({
  userProfileId: { type: String, ref: 'userProfile', required: true, unique: true },
  message: { type: String }
});

export default model('SchemaChat', SchemaChat);
