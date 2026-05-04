import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'El ID de la orden es requerido'],
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El ID del restaurante es requerido'],
    },
    amount: {
      type: Number,
      required: [true, 'El monto es requerido'],
      min: [0, 'El monto no puede ser negativo'],
    },
    method: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'paypal', 'bank_transfer'],
      required: [true, 'El método de pago es requerido'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      trim: true,
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

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ restaurantId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);