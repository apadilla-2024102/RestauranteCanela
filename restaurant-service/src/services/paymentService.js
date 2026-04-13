const { Payment, Order } = require('../models');

class PaymentService {
    async getPayments(orderId) {
        return await Payment.findAll({ where: { orderId } });
    }

    async getPayment(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            throw new Error('Payment not found');
        }
        return payment;
    }

    async createPayment(data) {
        const order = await Order.findByPk(data.orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return await Payment.create(data);
    }

    async updatePaymentStatus(id, status) {
        const payment = await this.getPayment(id);
        await payment.update({ status });
        return payment;
    }
}

module.exports = new PaymentService();