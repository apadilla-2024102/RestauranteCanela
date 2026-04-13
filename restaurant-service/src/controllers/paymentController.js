const paymentService = require('../services/paymentService');

class PaymentController {
    async getPayments(req, res) {
        try {
            const { orderId } = req.params;
            const payments = await paymentService.getPayments(orderId);
            res.json({
                success: true,
                message: 'Payments retrieved successfully',
                data: payments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getPayment(req, res) {
        try {
            const { id } = req.params;
            const payment = await paymentService.getPayment(id);
            res.json({
                success: true,
                message: 'Payment retrieved successfully',
                data: payment
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createPayment(req, res) {
        try {
            const data = req.body;
            const payment = await paymentService.createPayment(data);
            res.status(201).json({
                success: true,
                message: 'Payment created successfully',
                data: payment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updatePaymentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const payment = await paymentService.updatePaymentStatus(id, status);
            res.json({
                success: true,
                message: 'Payment status updated successfully',
                data: payment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PaymentController();