import Payment from './payment.model.js';

class PaymentService {
  async createPayment(paymentData) {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  }

  async fetchAllPayments() {
    return Payment.find().populate('orderId').populate('restaurantId', 'name');
  }

  async fetchPaymentById(id) {
    return Payment.findById(id).populate('orderId').populate('restaurantId', 'name');
  }

  async updatePaymentById(id, updateData) {
    const payment = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('orderId').populate('restaurantId', 'name');
    return payment;
  }

  async deletePaymentById(id) {
    return Payment.findByIdAndDelete(id);
  }

  async fetchPaymentsByOrder(orderId) {
    return Payment.find({ orderId }).populate('orderId').populate('restaurantId', 'name');
  }

  async fetchPaymentsByRestaurant(restaurantId) {
    return Payment.find({ restaurantId }).populate('orderId').populate('restaurantId', 'name');
  }

  async fetchPaymentsByStatus(status) {
    return Payment.find({ status }).populate('orderId').populate('restaurantId', 'name');
  }
}

export default new PaymentService();