const { Restaurant } = require('../models');

class RestaurantService {
    async getRestaurant(id) {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }
        return restaurant;
    }

    async updateRestaurant(id, data) {
        const restaurant = await this.getRestaurant(id);
        await restaurant.update(data);
        return restaurant;
    }

    async createRestaurant(data) {
        return await Restaurant.create(data);
    }

    async deleteRestaurant(id) {
        const restaurant = await this.getRestaurant(id);
        await restaurant.destroy();
        return { message: 'Restaurant deleted successfully' };
    }
}

module.exports = new RestaurantService();