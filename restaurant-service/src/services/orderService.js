const { Order, OrderItem, Cart } = require('../models');

class OrderService {
    async getOrders(userId) {
        return await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, as: 'orderItems' }]
        });
    }

    async getOrder(id, userId) {
        const order = await Order.findOne({
            where: { id, userId },
            include: [{ model: OrderItem, as: 'orderItems' }]
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async createOrder(userId, restaurantId, deliveryAddress, notes) {
        const cart = await Cart.findOne({ where: { userId, restaurantId } });
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const order = await Order.create({
            userId,
            restaurantId,
            total: cart.total,
            deliveryAddress,
            notes
        });

        for (const item of cart.items) {
            await OrderItem.create({
                orderId: order.id,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: item.price
            });
        }

        // Clear cart
        await cart.update({ items: [], total: 0 });

        return order;
    }

    async updateOrderStatus(id, status) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new Error('Order not found');
        }
        await order.update({ status });
        return order;
    }
}

module.exports = new OrderService();