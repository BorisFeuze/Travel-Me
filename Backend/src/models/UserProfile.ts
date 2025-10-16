import { model, Schema } from 'mongoose';
import { de } from 'zod/locales';
import { required } from 'zod/mini';

const userProfile = new Schema(
  {
    pictureURL: { type: String, default: '' },
    userId: { type: String, ref: 'User', required: true, unique: true },
    age: { type: Number, required: [true, 'Age is required'], default: 18 },
    continet: { type: String, required: [true, 'Continent is required'] },
    country: { type: String, required: [true, 'Country is required'] },
    gender: {
      male: {
        type: Boolean
      },
      female: {
        type: Boolean
      },
      other: {
        type: Boolean
      }
    },
    skills: { type: [String] },
    languages: { type: [String] },
    educations: { type: [String] }
  },
  {
    timestamps: true
  }
);

export default model('userProfile', userProfile);
