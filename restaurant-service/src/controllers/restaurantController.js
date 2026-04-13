const restaurantService = require('../services/restaurantService');

class RestaurantController {
    async getRestaurant(req, res) {
        try {
            const { id } = req.params;
            const restaurant = await restaurantService.getRestaurant(id);
            res.json({
                success: true,
                message: 'Restaurant retrieved successfully',
                data: restaurant
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const restaurant = await restaurantService.updateRestaurant(id, data);
            res.json({
                success: true,
                message: 'Restaurant updated successfully',
                data: restaurant
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async createRestaurant(req, res) {
        try {
            const data = req.body;
            const restaurant = await restaurantService.createRestaurant(data);
            res.status(201).json({
                success: true,
                message: 'Restaurant created successfully',
                data: restaurant
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteRestaurant(req, res) {
        try {
            const { id } = req.params;
            const result = await restaurantService.deleteRestaurant(id);
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

module.exports = new RestaurantController();