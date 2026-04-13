const cartService = require('../services/cartService');

class CartController {
    async getCart(req, res) {
        try {
            const { userId, restaurantId } = req.params;
            const cart = await cartService.getCart(userId, restaurantId);
            res.json({
                success: true,
                message: 'Cart retrieved successfully',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async addToCart(req, res) {
        try {
            const { userId, restaurantId } = req.params;
            const { menuItemId, quantity } = req.body;
            const cart = await cartService.addToCart(userId, restaurantId, menuItemId, quantity);
            res.json({
                success: true,
                message: 'Item added to cart successfully',
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { userId, restaurantId, menuItemId } = req.params;
            const cart = await cartService.removeFromCart(userId, restaurantId, menuItemId);
            res.json({
                success: true,
                message: 'Item removed from cart successfully',
                data: cart
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async clearCart(req, res) {
        try {
            const { userId, restaurantId } = req.params;
            const cart = await cartService.clearCart(userId, restaurantId);
            res.json({
                success: true,
                message: 'Cart cleared successfully',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CartController();