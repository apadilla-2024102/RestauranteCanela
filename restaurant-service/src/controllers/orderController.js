const orderService = require('../services/orderService');

class OrderController {
    async getOrders(req, res) {
        try {
            const userId = req.user.id; // Assuming auth middleware sets req.user
            const orders = await orderService.getOrders(userId);
            res.json({
                success: true,
                message: 'Orders retrieved successfully',
                data: orders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getOrder(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const order = await orderService.getOrder(id, userId);
            res.json({
                success: true,
                message: 'Order retrieved successfully',
                data: order
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const { restaurantId, deliveryAddress, notes } = req.body;
            const order = await orderService.createOrder(userId, restaurantId, deliveryAddress, notes);
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(id, status);
            res.json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new OrderController();