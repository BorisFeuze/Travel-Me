import { model, Schema } from 'mongoose';

const userProfile = new Schema(
  {
    pictureURL: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    age: { type: Number, required: [true, 'Age is required'], default: 18 },
    continent: { type: String, required: [true, 'Continent is required'] },
    country: { type: String, required: [true, 'Country is required'] },
    gender: { type: String, required: [true, 'genderi required'] },
    skills: { type: [String] },
    languages: { type: [String] },
    educations: { type: [String] }
  },
  {
    timestamps: true
  }
);

export default model('userProfile', userProfile);
