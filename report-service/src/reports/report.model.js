import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El ID del restaurante es requerido'],
    },
    type: {
      type: String,
      enum: ['sales', 'orders', 'reservations', 'payments', 'inventory', 'customers'],
      required: [true, 'El tipo de reporte es requerido'],
    },
    title: {
      type: String,
      required: [true, 'El título del reporte es requerido'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Los datos del reporte son requeridos'],
    },
    dateRange: {
      start: {
        type: Date,
        required: [true, 'La fecha de inicio es requerida'],
      },
      end: {
        type: Date,
        required: [true, 'La fecha de fin es requerida'],
      },
    },
    generatedBy: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reportSchema.index({ restaurantId: 1, type: 1, createdAt: -1 });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });

export default mongoose.model('Report', reportSchema);