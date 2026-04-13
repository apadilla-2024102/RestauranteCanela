const { Cart, MenuItem } = require('../models');

class CartService {
    async getCart(userId, restaurantId) {
        let cart = await Cart.findOne({ where: { userId, restaurantId } });
        if (!cart) {
            cart = await Cart.create({ userId, restaurantId, items: [], total: 0 });
        }
        return cart;
    }

    async addToCart(userId, restaurantId, menuItemId, quantity) {
        const cart = await this.getCart(userId, restaurantId);
        const menuItem = await MenuItem.findByPk(menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
            throw new Error('Menu item not available');
        }

        const items = cart.items || [];
        const existingItem = items.find(item => item.menuItemId === menuItemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({
                menuItemId,
                quantity,
                price: menuItem.price
            });
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.update({ items, total });

        return cart;
    }

    async removeFromCart(userId, restaurantId, menuItemId) {
        const cart = await this.getCart(userId, restaurantId);
        const items = cart.items.filter(item => item.menuItemId !== menuItemId);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await cart.update({ items, total });
        return cart;
    }

    async clearCart(userId, restaurantId) {
        const cart = await this.getCart(userId, restaurantId);
        await cart.update({ items: [], total: 0 });
        return cart;
    }
}

module.exports = new CartService();