import Restaurant from './restaurant.model.js';

class RestaurantService {
  async createRestaurant(restaurantData) {
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    return restaurant;
  }

  async fetchAllRestaurants() {
    return Restaurant.find();
  }

  async fetchRestaurantById(id) {
    return Restaurant.findById(id);
  }

  async updateRestaurantById(id, updateData) {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return null;
    }
    if (!restaurant.isActive) {
      throw new Error('No se puede actualizar un restaurante inactivo');
    }

    Object.assign(restaurant, updateData);
    await restaurant.save();
    return restaurant;
  }

  async deactivateRestaurantById(id) {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return null;
    }

    restaurant.isActive = false;
    await restaurant.save();
    return restaurant;
  }
}

export default new RestaurantService();