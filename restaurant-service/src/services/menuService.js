const { MenuItem } = require('../models');

class MenuService {
    async getMenuItems(restaurantId) {
        return await MenuItem.findAll({ where: { restaurantId } });
    }

    async getMenuItem(id) {
        const item = await MenuItem.findByPk(id);
        if (!item) {
            throw new Error('Menu item not found');
        }
        return item;
    }

    async createMenuItem(data) {
        return await MenuItem.create(data);
    }

    async updateMenuItem(id, data) {
        const item = await this.getMenuItem(id);
        await item.update(data);
        return item;
    }

    async deleteMenuItem(id) {
        const item = await this.getMenuItem(id);
        await item.destroy();
        return { message: 'Menu item deleted successfully' };
    }
}

module.exports = new MenuService();