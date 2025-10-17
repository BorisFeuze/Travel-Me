import { model, Schema } from 'mongoose';

const jobOfferSchema = new Schema(
  {
    location: { type: String, required: [true, 'Location is required'] },
    userProfileId: { type: String, ref: 'userProfile', required: true, unique: true },
    pictureGallery: { type: [String], default: '' },
    description: { type: String, required: [true, 'Description is required'] },
    needs: { type: [String] },
    languages: { type: [String], required: [true, 'Language is required'] }
  },
  {
    timestamps: true
  }
);

export default model('jobOffer', jobOfferSchema);
