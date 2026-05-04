import mongoose from 'mongoose';

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'La dirección es requerida'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

restaurantSchema.index({ name: 1 });
restaurantSchema.index({ isActive: 1 });

export default mongoose.model('Restaurant', restaurantSchema);