import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El ID del restaurante es requerido'],
    },
    customerName: {
      type: String,
      required: [true, 'El nombre del cliente es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'La fecha es requerida'],
    },
    time: {
      type: String,
      required: [true, 'La hora es requerida'],
    },
    guests: {
      type: Number,
      required: [true, 'El número de invitados es requerido'],
      min: [1, 'Debe haber al menos 1 invitado'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reservationSchema.index({ restaurantId: 1, date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ email: 1 });

export default mongoose.model('Reservation', reservationSchema);