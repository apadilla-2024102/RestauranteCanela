const { Promotion } = require('../models');

class PromotionService {
    async getPromotions(restaurantId) {
        return await Promotion.findAll({ where: { restaurantId, isActive: true } });
    }

    async getPromotion(id) {
        const promotion = await Promotion.findByPk(id);
        if (!promotion) {
            throw new Error('Promotion not found');
        }
        return promotion;
    }

    async createPromotion(data) {
        return await Promotion.create(data);
    }

    async updatePromotion(id, data) {
        const promotion = await this.getPromotion(id);
        await promotion.update(data);
        return promotion;
    }

    async deletePromotion(id) {
        const promotion = await this.getPromotion(id);
        await promotion.destroy();
        return { message: 'Promotion deleted successfully' };
    }

    async applyCoupon(code, orderTotal) {
        const promotion = await Promotion.findOne({
            where: { code, isActive: true, type: 'coupon' }
        });
        if (!promotion) {
            throw new Error('Invalid coupon code');
        }

        let discount = 0;
        if (promotion.discountType === 'percentage') {
            discount = (orderTotal * promotion.discountValue) / 100;
        } else if (promotion.discountType === 'fixed') {
            discount = promotion.discountValue;
        }

        return { discount, promotion };
    }
}

module.exports = new PromotionService();