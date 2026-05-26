import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model('Order', orderSchema);
