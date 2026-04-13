const { Review } = require('../models');

class ReviewService {
    async getReviews(restaurantId) {
        return await Review.findAll({ where: { restaurantId } });
    }

    async getReview(id) {
        const review = await Review.findByPk(id);
        if (!review) {
            throw new Error('Review not found');
        }
        return review;
    }

    async createReview(data) {
        return await Review.create(data);
    }

    async updateReview(id, data) {
        const review = await this.getReview(id);
        await review.update(data);
        return review;
    }

    async deleteReview(id) {
        const review = await this.getReview(id);
        await review.destroy();
        return { message: 'Review deleted successfully' };
    }
}

module.exports = new ReviewService();