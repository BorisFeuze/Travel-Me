import { model, Schema } from 'mongoose';

const userProfile = new Schema(
  {
    pictureURL: {
      type: [String],
      required: [true, 'Image is required'],
      default:
        'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    age: { type: Number, required: [true, 'Age is required'], default: 18 },
    address: { type: String, required: [true, 'adresse is required'] },
    description: { type: String, required: [true, 'description is required'] },
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
