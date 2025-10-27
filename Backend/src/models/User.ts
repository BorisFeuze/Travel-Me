import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'Firstname is required'] },
    lastName: { type: String, required: [true, 'Lastname is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: false },
    phoneNumber: { type: String, required: [true, 'Phone Number is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'], select: true },
    roles: { type: [String], default: ['volunteer'] }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

export default model('user', userSchema);
