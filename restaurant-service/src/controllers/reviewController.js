const reviewService = require('../services/reviewService');

class ReviewController {
    async getReviews(req, res) {
        try {
            const { restaurantId } = req.params;
            const reviews = await reviewService.getReviews(restaurantId);
            res.json({
                success: true,
                message: 'Reviews retrieved successfully',
                data: reviews
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getReview(req, res) {
        try {
            const { id } = req.params;
            const review = await reviewService.getReview(id);
            res.json({
                success: true,
                message: 'Review retrieved successfully',
                data: review
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createReview(req, res) {
        try {
            const data = req.body;
            data.userId = req.user.id; // Assuming auth middleware
            const review = await reviewService.createReview(data);
            res.status(201).json({
                success: true,
                message: 'Review created successfully',
                data: review
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const review = await reviewService.updateReview(id, data);
            res.json({
                success: true,
                message: 'Review updated successfully',
                data: review
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const result = await reviewService.deleteReview(id);
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
}

module.exports = new ReviewController();