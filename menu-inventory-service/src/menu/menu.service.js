import MenuItem from './menu.model.js';

class MenuService {
  async createMenuItem(menuItemData) {
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    return menuItem;
  }

  async fetchAllMenuItems() {
    return MenuItem.find();
  }

  async fetchMenuItemById(id) {
    return MenuItem.findById(id);
  }

  async updateMenuItemById(id, updateData) {
    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return menuItem;
  }

  async deleteMenuItemById(id) {
    return MenuItem.findByIdAndDelete(id);
  }

  async fetchMenuItemsByRestaurant(restaurantId) {
    return MenuItem.find({ restaurantId });
  }

  async fetchMenuItemsByCategory(category) {
    return MenuItem.find({ category });
  }

  async fetchAvailableMenuItems() {
    return MenuItem.find({ isAvailable: true });
  }
}

export default new MenuService();