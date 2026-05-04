import MenuItem from './menu.model.js';

class MenuService {
  async createMenuItem(menuItemData) {
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    return menuItem;
  }

  async fetchAllMenuItems() {
    return MenuItem.find().populate('restaurantId', 'name');
  }

  async fetchMenuItemById(id) {
    return MenuItem.findById(id).populate('restaurantId', 'name');
  }

  async updateMenuItemById(id, updateData) {
    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('restaurantId', 'name');
    return menuItem;
  }

  async deleteMenuItemById(id) {
    return MenuItem.findByIdAndDelete(id);
  }

  async fetchMenuItemsByRestaurant(restaurantId) {
    return MenuItem.find({ restaurantId }).populate('restaurantId', 'name');
  }

  async fetchMenuItemsByCategory(category) {
    return MenuItem.find({ category }).populate('restaurantId', 'name');
  }

  async fetchAvailableMenuItems() {
    return MenuItem.find({ isAvailable: true }).populate('restaurantId', 'name');
  }
}

export default new MenuService();