import { model, Schema } from 'mongoose';
import { de } from 'zod/locales';

const userCardSchema = new Schema(
  {
    userId: { type: String, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0 },
    score: {
      wins: {
        type: Number,
        default: 0
      },
      losses: {
        type: Number,
        default: 0
      }
    },
    pokemonId: { type: Number, default: null }
  },
  {
    timestamps: true
  }
);

export default model('userCard', userCardSchema);
