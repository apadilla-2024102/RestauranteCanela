import Order from './order.model.js';

class OrderService {
  async createOrder(orderData) {
    const order = new Order(orderData);
    await order.save();
    return order;
  }

  async fetchAllOrders() {
    return Order.find().populate('restaurantId', 'name').populate('items.menuItemId', 'name');
  }

  async fetchOrderById(id) {
    return Order.findById(id).populate('restaurantId', 'name').populate('items.menuItemId', 'name');
  }

  async updateOrderById(id, updateData) {
    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('restaurantId', 'name').populate('items.menuItemId', 'name');
    return order;
  }

  async deleteOrderById(id) {
    return Order.findByIdAndDelete(id);
  }

  async fetchOrdersByRestaurant(restaurantId) {
    return Order.find({ restaurantId }).populate('restaurantId', 'name').populate('items.menuItemId', 'name');
  }

  async fetchOrdersByStatus(status) {
    return Order.find({ status }).populate('restaurantId', 'name').populate('items.menuItemId', 'name');
  }
}

export default new OrderService();