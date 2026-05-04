import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'El ID del item del menú es requerido'],
  },
  name: {
    type: String,
    required: [true, 'El nombre del item es requerido'],
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser al menos 1'],
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
  },
});

const orderSchema = mongoose.Schema(
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
    items: [orderItemSchema],
    total: {
      type: Number,
      required: [true, 'El total es requerido'],
      min: [0, 'El total no puede ser negativo'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
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

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerName: 1 });

export default mongoose.model('Order', orderSchema);