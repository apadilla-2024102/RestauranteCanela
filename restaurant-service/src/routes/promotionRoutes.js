const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

router.get('/restaurant/:restaurantId', promotionController.getPromotions);
router.get('/:id', promotionController.getPromotion);
router.post('/', promotionController.createPromotion);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);
router.post('/apply-coupon', promotionController.applyCoupon);

module.exports = router;