const menuService = require('../services/menuService');

class MenuController {
    async getMenuItems(req, res) {
        try {
            const { restaurantId } = req.params;
            const items = await menuService.getMenuItems(restaurantId);
            res.json({
                success: true,
                message: 'Menu items retrieved successfully',
                data: items
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getMenuItem(req, res) {
        try {
            const { id } = req.params;
            const item = await menuService.getMenuItem(id);
            res.json({
                success: true,
                message: 'Menu item retrieved successfully',
                data: item
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createMenuItem(req, res) {
        try {
            const data = req.body;
            const item = await menuService.createMenuItem(data);
            res.status(201).json({
                success: true,
                message: 'Menu item created successfully',
                data: item
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateMenuItem(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const item = await menuService.updateMenuItem(id, data);
            res.json({
                success: true,
                message: 'Menu item updated successfully',
                data: item
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteMenuItem(req, res) {
        try {
            const { id } = req.params;
            const result = await menuService.deleteMenuItem(id);
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

module.exports = new MenuController();