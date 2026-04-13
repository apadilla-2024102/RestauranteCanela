const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId/:restaurantId', cartController.getCart);
router.post('/:userId/:restaurantId/add', cartController.addToCart);
router.delete('/:userId/:restaurantId/remove/:menuItemId', cartController.removeFromCart);
router.delete('/:userId/:restaurantId/clear', cartController.clearCart);

module.exports = router;