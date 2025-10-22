import { model, Schema } from 'mongoose';

const jobOfferSchema = new Schema(
  {
    location: { type: String, required: [true, 'Location is required'] },
    userProfileId: { type: Schema.Types.ObjectId, ref: 'userProfile', required: true },
    pictureURL: { type: [String], default: '' },
    description: { type: String, required: [true, 'Description is required'] },
    needs: { type: [String] },
    languages: { type: [String], required: [true, 'Language is required'] }
  },
  {
    timestamps: true
  }
);

export default model('jobOffer', jobOfferSchema);
