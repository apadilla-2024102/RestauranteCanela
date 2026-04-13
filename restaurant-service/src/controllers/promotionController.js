const promotionService = require('../services/promotionService');

class PromotionController {
    async getPromotions(req, res) {
        try {
            const { restaurantId } = req.params;
            const promotions = await promotionService.getPromotions(restaurantId);
            res.json({
                success: true,
                message: 'Promotions retrieved successfully',
                data: promotions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getPromotion(req, res) {
        try {
            const { id } = req.params;
            const promotion = await promotionService.getPromotion(id);
            res.json({
                success: true,
                message: 'Promotion retrieved successfully',
                data: promotion
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createPromotion(req, res) {
        try {
            const data = req.body;
            const promotion = await promotionService.createPromotion(data);
            res.status(201).json({
                success: true,
                message: 'Promotion created successfully',
                data: promotion
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updatePromotion(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const promotion = await promotionService.updatePromotion(id, data);
            res.json({
                success: true,
                message: 'Promotion updated successfully',
                data: promotion
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deletePromotion(req, res) {
        try {
            const { id } = req.params;
            const result = await promotionService.deletePromotion(id);
            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async applyCoupon(req, res) {
        try {
            const { code, orderTotal } = req.body;
            const result = await promotionService.applyCoupon(code, orderTotal);
            res.json({
                success: true,
                message: 'Coupon applied successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new PromotionController();