import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model('Restaurant', restaurantSchema);
